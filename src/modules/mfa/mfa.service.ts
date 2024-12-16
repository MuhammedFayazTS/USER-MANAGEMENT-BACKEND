import { Request } from "express";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import db from "../../database/database";
import { refreshTokenSignOptions, signJwtToken } from "../../common/utils/jwt";

export class MfaService {
  public async generateMFASetup(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (user.userPreference?.enable2FA) {
      return {
        message: "MFA already enabled",
      };
    }

    let secretkey = user.userPreference?.twoFactorSecret;

    if (!secretkey) {
      const secret = speakeasy.generateSecret({ name: "Nexus Flow" }); //company name
      secretkey = secret.base32;
      const userPreference = await db.UserPreference.findOne({
        where: { userId: user.id },
      });
      userPreference.twoFactorSecret = secretkey;
      await userPreference.save();
    }

    const url = speakeasy.otpauthURL({
      secret: secretkey,
      label: `${user.firstName} ${user.lastName}`,
      issuer: "nexusFlow-dev.com", //update with the company,
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(url);

    return {
      message: "Scan the QR code or use the secret key.",
      secret: secretkey,
      qrImageUrl,
    };
  }

  public async verifyMFASetup(req: Request, code: string, secretKey: string) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (user.userPreference?.enable2FA) {
      return {
        message: "MFA already enabled",
        userPreference: {
          enable2FA: user.userPreference.enable2FA,
        },
      };
    }

    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code, please try again.");
    }

    const userPreference = await db.UserPreference.findOne({
      where: { userId: user.id },
    });

    userPreference.enable2FA = true;

    await userPreference.save();

    return {
      message: "MFA setup completed successfully",
      userPreference: {
        enable2FA: userPreference.enable2FA,
      },
    };
  }

  public async recokeMFA(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    const userPreference = await db.UserPreference.findOne({
      where: { userId: user.id },
      attributes: ["id", "twoFactorSecret", "enable2FA"],
    });

    if (!userPreference.enable2FA) {
      return {
        message: "MFA is not enabled",
        userPreference: {
          enable2FA: userPreference.enable2FA,
        },
      };
    }

    userPreference.twoFactorSecret = undefined;
    userPreference.enable2FA = false;
    await userPreference.save();

    return {
      message: "MFA revoke successful",
      userPreference: {
        enable2FA: userPreference.enable2FA,
      },
    };
  }

  public async verifyMFAForLogin(
    code: string,
    email: string,
    userAgent?: string
  ) {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userPreference = await db.UserPreference.findOne({
      where: { userId: user.id },
    });

    if (!userPreference.enable2FA && !userPreference.twoFactorSecret) {
      throw new UnauthorizedException("MFA not enabled for this user");
    }

    const isValid = speakeasy.totp.verify({
      secret: userPreference.twoFactorSecret,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code, please try again.");
    }

    const session = await db.Session.create({
      userId: user.id,
      userAgent,
    });

    const accessToken = signJwtToken({
      userId: user.id,
      sessionId: session.id,
    });

    const refreshToken = signJwtToken(
      { sessionId: session.id },
      refreshTokenSignOptions
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

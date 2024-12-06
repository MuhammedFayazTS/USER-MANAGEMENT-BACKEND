//Handle the buisness logic

import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "../../common/interfaces/auth.interface";
import {
  BadRequestException,
  HttpException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import {
  anHourFromNow,
  calculateExpirationDate,
  fortyFiveMinutesFromNow,
  ONE_DAY_IN_MS,
  threeMinuteAgo,
} from "../../common/utils/date-time";
import jwt from "jsonwebtoken";
import db from "../../database/database";
import { config } from "../../config/app.config";
import {
  refreshTokenSignOptions,
  RefreshTPayload,
  signJwtToken,
  verifyJwtToken,
} from "../../common/utils/jwt";
import { Op, Sequelize } from "sequelize";
import { sendEmail } from "../../mailers/mailer";
import {
  passwordResetTemplate,
  verifyEmailTemplate,
} from "../../mailers/templates/template";
import { HTTPSTATUS } from "../../config/http.config";
import { hashValue } from "../../common/utils/bcrypt";

export class AuthService {
  public async register(registerData: RegisterDto) {
    const { name, email, password } = registerData;
    const transaction = await db.createDBTransaction();

    const existingUser = await db.User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        "User already exists with this email",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const newUser = await db.User.create(
      {
        name,
        email,
        password,
      },
      { transaction }
    );

    const userId = newUser.id;

    const userPreference = await db.UserPreference.create(
      {
        userId,
      },
      {
        transaction,
      }
    );

    const verification = await db.VerificationCode.create(
      {
        userId,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: fortyFiveMinutesFromNow(),
      },
      { transaction }
    );

    transaction.commit();

    const userWithPreference = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.UserPreference,
          as: "userPreference",
        },
      ],
    });

    const verificationUrl = `${config.APP_ORIGIN}/confirm-account?code=${verification.code}`;

    await sendEmail({
      to: newUser.email,
      ...verifyEmailTemplate(verificationUrl, "Brand Name"), //need to change the brand name or make it dynamic
    });

    return {
      user: userWithPreference.toJSON(),
    };
  }

  public async login(loginData: LoginDto) {
    const { email, password, userAgent } = loginData;
    const transaction = await db.createDBTransaction();

    const user = await db.User.findOne({
      where: { email },
      include: {
        model: db.UserPreference,
        attributes: ["enable2FA"],
        as:'userPreference'
      },
    });

    if (!user) {
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    // check if email user enabled 2Fa return user = null
    if (user.userPreference.enable2FA) {
      return {
        user: null,
        mfaRequired: true,
        accessToken: "",
        refreshToken: "",
      };
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
      mfaRequired: false,
    };
  }

  public async refreshToken(refreshToken: string) {
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await db.Session.findOne({
      where: {
        id: payload.sessionId,
      },
    });

    const now = Date.now();

    if (!session) {
      throw new UnauthorizedException("Session does not exist");
    }

    if (session.expiredAt.getTime() <= now) {
      throw new UnauthorizedException("Session expired");
    }

    const sessionRequireRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

    if (sessionRequireRefresh) {
      session.expiredAt = calculateExpirationDate(
        config.JWT.JWT_REFRESH_EXPIRES_IN
      );
      await session.save();
    }

    const newRefreshToken = sessionRequireRefresh
      ? signJwtToken(
          {
            sessionId: session.id,
          },
          refreshTokenSignOptions
        )
      : undefined;

    const accessToken = signJwtToken({
      userId: session.userId,
      sessionId: session.id,
    });

    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async verifyEmail(code: string) {
    const validCode = await db.VerificationCode.findOne({
      where: {
        code,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!validCode) {
      throw new BadRequestException("Invalid or expired verification code");
    }

    const updatedUser = await db.User.findOne({
      where: {
        id: validCode.userId,
      },
    });

    await updatedUser.update({ isEmailVerified: true });

    if (!updatedUser) {
      throw new BadRequestException(
        "Unable to verify email address",
        ErrorCode.VALIDATION_ERROR
      );
    }

    await validCode.destroy();

    return {
      user: updatedUser,
    };
  }

  public async forgotPassword(email: string) {
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // check mail rate limit is 2 emails per 3 minutes

    const timeAgo = threeMinuteAgo();
    const maxAttempts = 2;

    const count = await db.VerificationCode.count({
      where: {
        userId: user.id,
        type: VerificationEnum.PASSWORD_RESET,
        createdAt: {
          [Op.gt]: timeAgo,
        },
      },
    });

    if (count >= maxAttempts) {
      throw new HttpException(
        "Too many requests, try again later",
        HTTPSTATUS.TOO_MANY_REQUESTS,
        ErrorCode.AUTH_TOO_MANY_ATTEMPTS
      );
    }

    const expiresAt = anHourFromNow();
    const validCode = await db.VerificationCode.create({
      userId: user.id,
      type: VerificationEnum.PASSWORD_RESET,
      expiresAt,
    });

    const resetLink = `${config.APP_ORIGIN}/reset-password?code=${validCode.code}&exp=${expiresAt.getTime()}`;

    const { data, error } = await sendEmail({
      to: user.email,
      ...passwordResetTemplate(resetLink, "Auth Advanced"),
    });

    if (!data?.id) {
      throw new InternalServerException(`${error?.name} ${error?.message}`);
    }

    return {
      url: resetLink,
      emailId: data.id,
    };
  }

  public async resetPassword({ password, verificationCode }: ResetPasswordDto) {
    const validCode = await db.VerificationCode.findOne({
      where: {
        code: verificationCode,
        type: VerificationEnum.PASSWORD_RESET,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!validCode) {
      throw new NotFoundException(
        "Invalid or expired verification code",
        ErrorCode.RESOURCE_NOT_FOUND
      );
    }

    const user = await db.User.findOne({
      where: {
        id: validCode.userId,
      },
    });

    if (!user) {
      throw new BadRequestException(
        "User does not exist",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    await user.update({ password });

    if (!user) {
      throw new BadRequestException("Failed to reset password");
    }

    await validCode.destroy();

    await db.Session.destroy({
      where: {
        userId: user.id,
      },
    });

    return { user };
  }

  public async logout(sessionId: number) {
    return await db.Session.destroy({
      where: {
        id: sessionId,
      },
    });
  }
}

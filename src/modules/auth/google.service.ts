import { GoogleLoginUser } from "../../common/strategies/google.strategy";
import { refreshTokenSignOptions, signJwtToken } from "../../common/utils/jwt";
import db from "../../database/database";
import { userService } from "../user/user.module";

export class GoogleAuthService {
  public async googleLogin(googleLoginInput: GoogleLoginUser) {
    let user = await userService.findUserByEmail(googleLoginInput.email);

    if (!user) {
      user = await userService.createUser({
        firstName: googleLoginInput.firstName,
        lastName: googleLoginInput.lastName,
        image: googleLoginInput.image,
        email: googleLoginInput.email,
        externalUserId: googleLoginInput.externalUserId,
        isEmailVerified: true,
        origin: "google",
      });
    }

    const session = await db.Session.create({
      userId: user.id,
      userAgent: googleLoginInput.userAgent,
    });

    const accessToken = signJwtToken({
      userId: user.id,
      sessionId: session.id,
    });

    const refreshToken = signJwtToken(
      { sessionId: session.id },
      refreshTokenSignOptions
    );

    return { user, accessToken, refreshToken, mfaRequired: false };
  }
}

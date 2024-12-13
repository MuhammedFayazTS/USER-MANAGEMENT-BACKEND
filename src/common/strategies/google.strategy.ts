import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../../config/app.config";
import { userService } from "../../modules/user/user.module";
import { BadRequestException } from "../utils/catch-errors";
import { UserAttributes } from "../../database/models/user.model";

export const setupGoogleStrategy = (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.BASE_PATH}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, emails, id } = profile;

          if (!emails || !emails.length || !emails[0].value) {
            throw new BadRequestException("Email not found");
          }

          const user: UserAttributes = {
            email: emails[0].value,
            name: name?.givenName + ' ' + name?.familyName,
            externalUserId: id,
            isEmailVerified: false,
          };

          done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user: UserAttributes, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email: string, done) => {
    try {
      const user = await userService.findUserByEmail(email);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export class GoogleLoginUser {
  email!: string;
  name!: string;
  // firstName!: string;
  // middleName?: string;
  // lastName!: string;
  externalUserId!: string;
  userAgent!: string;
}

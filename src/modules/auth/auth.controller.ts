import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../../config/http.config";
import {
  changePasswordSchema,
  emailSchema,
  googleAuthSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verficationEmailSchema,
} from "../../common/validators/auth.validator";
import {
  clearAuthenticationCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from "../../common/utils/cookie";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import { GoogleAuthService } from "./google.service";
import { GoogleLoginUser } from "../../common/strategies/google.strategy";
import { config } from "../../config/app.config";
import { assertDefined } from "../../common/utils/common";

export class AuthController {
  private authService: AuthService;
  private googleService: GoogleAuthService;

  constructor(authService: AuthService, googleService: GoogleAuthService) {
    this.authService = authService;
    this.googleService = googleService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = registerSchema.parse({
        ...req.body,
      });

      const { user } = await this.authService.register(body);
      return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
        data: user,
      });
    }
  );

  public login = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const userAgent = req.headers["user-agent"];
      const body = loginSchema.parse({
        ...req.body,
        userAgent,
      });

      const { user, accessToken, refreshToken, mfaRequired } =
        await this.authService.login(body);

      if (mfaRequired === true) {
        return res.status(HTTPSTATUS.OK).json({
          message: "Verify MFA authentication",
          mfaRequired,
          user,
        });
      }

      return setAuthenticationCookies({
        res,
        accessToken,
        refreshToken,
      })
        .status(HTTPSTATUS.OK)
        .json({
          message: "User login successfully",
          mfaRequired,
          user,
        });
    }
  );

  public refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const refreshToken = req.cookies.refreshToken as string | undefined;
      if (!refreshToken) {
        throw new UnauthorizedException("Missing refresh token");
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      if (newRefreshToken) {
        res.cookie(
          "refreshToken",
          newRefreshToken,
          getRefreshTokenCookieOptions()
        );
      }

      return res
        .status(HTTPSTATUS.OK)
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .json({
          message: "Refresh access token successfully",
        });
    }
  );

  public verifyEmail = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { code } = verficationEmailSchema.parse(req.body);

      await this.authService.verifyEmail(code);

      return res.status(HTTPSTATUS.OK).json({
        message: "Email verified successfully",
      });
    }
  );

  public forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const email = emailSchema.parse(req.body.email);

      await this.authService.forgotPassword(email);

      return res.status(HTTPSTATUS.OK).json({
        message: "Password reset email sent",
      });
    }
  );

  public resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = resetPasswordSchema.parse(req.body);

      await this.authService.resetPassword(body);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "Password reset successfully",
      });
    }
  );

  public changePassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const {oldPassword,password} = changePasswordSchema.parse(req.body);
      const userId = req.user?.id;
      assertDefined(userId, 'User id must be provided');
      await this.authService.changePassword({oldPassword,password,userId});

      return res.status(HTTPSTATUS.OK).json({
        message: "Password changed successfully",
      });
    }
  );

  public logout = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const sessionId = req.sessionId;

      if (!sessionId) {
        throw new NotFoundException("Session is invalid.");
      }

      await this.authService.logout(sessionId);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "User logout successful",
      });
    }
  );

  //google oAuth
  public googleLogin = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const userAgent = req.headers["user-agent"];
      const googleUser = googleAuthSchema.parse({ ...req.user, userAgent });
      if (!googleUser || !googleUser.externalUserId) {
        throw new BadRequestException("Google login failed");
      }

      const { accessToken, refreshToken } =
        await this.googleService.googleLogin(
          googleUser as unknown as GoogleLoginUser
        );

      return setAuthenticationCookies({
        res,
        accessToken,
        refreshToken,
      })
        .status(HTTPSTATUS.OK)
        .redirect(config.APP_ORIGIN);
    }
  );
}

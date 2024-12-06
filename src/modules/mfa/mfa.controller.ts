import { Request } from "express-serve-static-core";
import { asyncHandler } from "../../middleware/asyncHandler";
import { MfaService } from "./mfa.service";
import { Response } from "express";
import { HTTPSTATUS } from "../../config/http.config";
import {
  verifyMFAForLoginSchema,
  verifyMFASchema,
} from "../../common/validators/mfa.validator";
import { setAuthenticationCookies } from "../../common/utils/cookie";

export class MfaController {
  private mfaService: MfaService;
  constructor(mfaService: MfaService) {
    this.mfaService = mfaService;
  }

  public generateMFASetup = asyncHandler(
    async (req: Request, res: Response) => {
      const { secret, qrImageUrl, message } =
        await this.mfaService.generateMFASetup(req);

      return res.status(HTTPSTATUS.OK).json({
        message,
        secret,
        qrImageUrl,
      });
    }
  );

  public verifyMFASetup = asyncHandler(async (req: Request, res: Response) => {
    const { code, secretKey } = verifyMFASchema.parse(req.body);
    const { message, userPreference } = await this.mfaService.verifyMFASetup(
      req,
      code,
      secretKey
    );

    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreference,
    });
  });

  public recokeMFA = asyncHandler(async (req: Request, res: Response) => {
    const { message, userPreference } = await this.mfaService.recokeMFA(req);

    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreference,
    });
  });

  public verifyMFAForLogin = asyncHandler(
    async (req: Request, res: Response) => {
      const { code, email, userAgent } = verifyMFAForLoginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
      });

      const { accessToken, refreshToken, user } =
        await this.mfaService.verifyMFAForLogin(code, email, userAgent);

      return setAuthenticationCookies({ res, accessToken, refreshToken })
        .status(HTTPSTATUS.OK)
        .json({
          message: "Verified and login successful",
          user,
        });
    }
  );
}

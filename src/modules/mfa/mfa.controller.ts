import { Request } from "express-serve-static-core";
import { asyncHandler } from "../../middleware/asyncHandler";
import { MfaService } from "./mfa.service";
import { Response } from "express";
import { HTTPSTATUS } from "../../config/http.config";
import { verifyMFASchema } from "../../common/validators/mfa.validator";

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
}

import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  public getPaymentModesForSelect = asyncHandler(
      async (_req: Request, res: Response) => {
        const paymentModes = await this.paymentService.getPaymentModesForSelect();
  
        return res.status(HTTPSTATUS.OK).json({
          message: "Payment Modes for select fetched",
          paymentModes,
        });
      }
    );
}

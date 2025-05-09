import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}
}

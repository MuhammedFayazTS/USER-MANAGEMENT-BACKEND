import { Router } from "express";
import { paymentController } from "./payment.module";

const paymentRoutes = Router();

// paymentRoutes.post("/", paymentController.createBooking);
paymentRoutes.get("/modes/select", paymentController.getPaymentModesForSelect);

export default paymentRoutes;

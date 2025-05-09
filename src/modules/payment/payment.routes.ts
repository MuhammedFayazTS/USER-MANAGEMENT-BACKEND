import { Router } from "express";
import { paymentController } from "./payment.module";

const paymentRoutes = Router();

// paymentRoutes.post("/", paymentController.createBooking);

export default paymentRoutes;

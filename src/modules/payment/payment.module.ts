import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";

const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

export { paymentService, paymentController };

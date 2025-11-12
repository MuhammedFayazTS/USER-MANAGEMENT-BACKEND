import { PaymentService } from "../payment/payment.service";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";


const bookingService = new BookingService();
const paymentService = new PaymentService();
const bookingController = new BookingController(bookingService,paymentService);

export { bookingService, bookingController };

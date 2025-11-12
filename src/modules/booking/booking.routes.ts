import { Router } from "express";
import { bookingController } from "./booking.module";
import { attachUserId } from "../../middleware/attach-user-id";

const bookingRoutes = Router();

bookingRoutes.post("/",attachUserId, bookingController.createBooking);

bookingRoutes.post("/:id/check-in", bookingController.checkInBooking);

bookingRoutes.post("/:id/check-out", bookingController.checkOutBooking);

bookingRoutes.post("/:id/cancel", bookingController.cancelBooking);

bookingRoutes.get("/:id", bookingController.getOneBooking);

bookingRoutes.get("/", bookingController.getAllBookings);

bookingRoutes.get("/logs", bookingController.listBookingLogs);

export default bookingRoutes;

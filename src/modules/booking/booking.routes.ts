import { Router } from "express";
import { bookingController } from "./booking.module";

const bookingRoutes = Router();

bookingRoutes.post("/", bookingController.createBooking);

bookingRoutes.post("/:id/check-in", bookingController.checkInBooking);

bookingRoutes.post("/:id/check-out", bookingController.checkOutBooking);

bookingRoutes.post("/:id/cancel", bookingController.cancelBooking);

bookingRoutes.get("/:id", bookingController.getOneBooking);

bookingRoutes.get("/", bookingController.getAllBookings);

bookingRoutes.get("/logs", bookingController.listBookingLogs);

export default bookingRoutes;

import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { BookingService } from "./booking.service";
import { bookingSchema } from "../../common/validators/booking.validator";
import { assertDefined } from "../../common/utils/common";
import { HTTPSTATUS } from "../../config/http.config";
import { PaymentService } from "../payment/payment.service";
import db from "../../database/database";
import {
  getAmountPaid,
  updateAmountPaid,
  validateFinalPayment,
} from "../../common/utils/payment";

export class BookingController {
  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  public createBooking = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    assertDefined(userId, "User id is not defined");

    const bookingData = bookingSchema.parse(req.body);
    const transaction = await db.createDBTransaction();

    try {
      let booking = await this.bookingService.createBooking(
        bookingData,
        userId,
        transaction
      );

      const isPaymentInBooking =
        bookingData.paymentAmount &&
        bookingData.paymentAmount > 0 &&
        bookingData.paymentModeId;

      if (isPaymentInBooking) {
        const payment = await this.paymentService.createPaymentFromBooking(
          {
            ...bookingData,
            id: booking.id,
          },
          userId,
          transaction
        );

        booking = await updateAmountPaid(
          booking.id,
          transaction,
          payment?.amount
        );
      }

      await transaction.commit();

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Booking created successfully",
        booking,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  });

  public checkInBooking = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const bookingId = req.params?.id;
    assertDefined(bookingId, "Booking Id is not provided");
    assertDefined(userId, "User id is not defined");

    const bookingData = req.body;
    const transaction = await db.createDBTransaction();

    try {
      let booking = await this.bookingService.checkInBooking(
        Number(bookingId),
        userId,
        bookingData?.paymentAmount,
        transaction
      );

      const isPaymentInBooking =
        bookingData.paymentAmount &&
        bookingData.paymentAmount > 0 &&
        bookingData.paymentModeId;

      if (isPaymentInBooking) {
        const payment = await this.paymentService.createPaymentFromBooking(
          {
            ...bookingData,
            id: booking.id,
          },
          userId,
          transaction
        );

        booking = await updateAmountPaid(
          booking.id,
          transaction,
          payment?.amount
        );
      }

      await transaction.commit();
      return res.status(HTTPSTATUS.CREATED).json({
        message: "Check In successfully",
        booking,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  });

  public checkOutBooking = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const bookingId = req.params?.id;
    assertDefined(bookingId, "Booking Id is not provided");
    assertDefined(userId, "User id is not defined");

    const bookingData = req.body;
    const transaction = await db.createDBTransaction();

    try {
      let booking = await this.bookingService.checkOutBooking(
        Number(bookingId),
        userId,
        bookingData?.paymentAmount,
        transaction
      );

      const isPaymentInBooking =
        bookingData.paymentAmount &&
        bookingData.paymentAmount > 0 &&
        bookingData.paymentModeId;

      if (isPaymentInBooking) {
        await validateFinalPayment(
          booking.id,
          bookingData.paymentAmount,
          +booking.netAmount,
          transaction
        );

        const payment = await this.paymentService.createPaymentFromBooking(
          {
            ...bookingData,
            id: booking.id,
          },
          userId,
          transaction
        );

        booking = await updateAmountPaid(
          booking.id,
          transaction,
          payment?.amount
        );
      }

      await transaction.commit();
      return res.status(HTTPSTATUS.CREATED).json({
        message: "Check Out successfully",
        booking,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  });

  public cancelBooking = asyncHandler(async (req: Request, res: Response) => {
    // TODO: Update the refund based on the refund policy, which is to be made
    const userId = req.user?.id;
    const bookingId = req.params?.id;
    assertDefined(bookingId, "Booking Id is not provided");
    assertDefined(userId, "User id is not defined");

    const bookingData = req.body;
    const transaction = await db.createDBTransaction();

    try {
      let booking = await this.bookingService.cancelBooking(
        Number(bookingId),
        userId,
        bookingData?.paymentAmount,
        transaction
      );

      const isRefundAmount =
        bookingData.paymentAmount &&
        bookingData.paymentAmount > 0 &&
        bookingData.paymentModeId;

      if (isRefundAmount) {
        const payment = await this.paymentService.createPaymentFromBooking(
          {
            ...bookingData,
            id: booking.id,
            paymentType: "refund",
          },
          userId,
          transaction
        );

        booking = await updateAmountPaid(
          booking.id,
          transaction,
          payment?.amount,
          isRefundAmount
        );
      }

      await transaction.commit();

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Booking canceled successfully",
        booking,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  });

  public getOneBooking = asyncHandler(async (req: Request, res: Response) => {
    const bookingId = req.params?.id;
    assertDefined(bookingId, "Booking Id is not provided");
    const booking = await this.bookingService.getOneBooking(Number(bookingId));

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Booking fetched successfully",
      booking,
    });
  });

  public getAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.getAllBookings();

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Bookings fetched successfully",
      booking,
    });
  });

  public listBookingLogs = asyncHandler(async (req: Request, res: Response) => {
    const bookingLogs = await this.bookingService.listBookingLogs();

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Booking logs listed successfully",
      bookingLogs,
    });
  });
}

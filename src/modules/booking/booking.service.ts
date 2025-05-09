import { literal, Transaction } from "sequelize";
import db from "../../database/database";
import { BookingAttributes } from "../../database/models/booking.model";
import { BookingActionType } from "../../database/models/bookinglog";

export class BookingService {
  public async createBooking(
    bookingData: BookingAttributes,
    userId: number,
    transaction: Transaction
  ) {
    const booking = await db.Booking.create(bookingData, { transaction });
    if (!booking || !booking.id) {
      throw new Error("Error while booking");
    }
    await this.createBookingLog(
      booking.id,
      userId,
      bookingData.status,
      bookingData.paymentAmount ?? 0,
      transaction
    );
    return booking;
  }

  public async checkInBooking(bookingId: number, userId: number) {
    const booking = await db.Booking.findOne({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "booked") {
      throw new Error("Only booked reservations can be checked in");
    }

    booking.status = "checked-in";
    booking.actualCheckIn = new Date();
    booking.updatedAt = new Date();
    booking.createdBy = userId;

    await this.createBookingLog(
      booking.id,
      userId,
      "checked-in",
      0 //Replace with payment amount
    );

    await booking.save();
    return booking;
  }

  public async checkOutBooking(bookingId: number, userId: number) {
    const booking = await db.Booking.findOne({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "checked-in") {
      throw new Error("Only checked-in bookings can be checked out");
    }

    booking.status = "checked-out";
    booking.actualCheckOut = new Date();
    booking.updatedAt = new Date();
    booking.createdBy = userId;

    await this.createBookingLog(
      booking.id,
      userId,
      "checked-out",
      0 //Replace with payment amount
    );

    await booking.save();
    return booking;
  }

  public async cancelBooking(bookingId: number, userId: number) {
    const booking = await db.Booking.findOne({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "booked") {
      throw new Error("Only booked reservations can be cancelled");
    }

    booking.status = "cancelled";
    booking.updatedAt = new Date();
    booking.createdBy = userId;

    await this.createBookingLog(
      booking.id,
      userId,
      "cancelled",
      0 // Replace with refund amount if needed
    );

    await booking.save();
    return booking;
  }

  public async getOneBooking(bookingId: number) {
    const booking = await db.Booking.findOne({
      where: { id: bookingId },
      include: [
        { model: db.Room, as: "room" },
        {
          model: db.Customer,
          as: "customer",
          attributes: [
            [
              literal(
                `CONCAT("createdByUser"."firstName", ' ', "createdByUser"."lastName")`
              ),
              "fullName",
            ],
          ],
        },
        { model: db.Branch, as: "branch" },
        {
          model: db.User,
          as: "createdByUser",
          attributes: [
            [
              literal(
                `CONCAT("createdByUser"."firstName", ' ', "createdByUser"."lastName")`
              ),
              "fullName",
            ],
          ],
        },
      ],
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  }

  public async getAllBookings() {
    const bookings = await db.Booking.findAll({
      include: [
        { model: db.Room, attributes: ["number"], as: "room" },
        {
          model: db.Customer,
          attributes: [
            [
              literal(
                `CONCAT("createdByUser"."firstName", ' ', "createdByUser"."lastName")`
              ),
              "fullName",
            ],
          ],
          as: "customer",
        },
        { model: db.Branch, as: "branch", attributes: ["name"] },
        {
          model: db.User,
          attributes: [
            [
              literal(
                `CONCAT("createdByUser"."firstName", ' ', "createdByUser"."lastName")`
              ),
              "fullName",
            ],
          ],
          as: "createdByUser",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return bookings;
  }

  public async listBookingLogs() {
    const bookingLogs = await db.BookingLog.findAll({
      include: [
        {
          model: db.User,
          attributes: [
            [
              literal(
                `CONCAT("createdByUser"."firstName", ' ', "createdByUser"."lastName")`
              ),
              "fullName",
            ],
          ],
          as: "user",
        },
        {
          model: db.Booking,
          attributes: ["checkInDate", "checkOutDate"],
          include: [
            {
              model: db.Room,
              as: "room",
              attributes: ["number"],
            },
          ],
          as: "booking",
        },
      ],
    });
    return bookingLogs;
  }

  private async createBookingLog(
    bookingId: number,
    userId: number,
    action: BookingActionType,
    amountPaid: number,
    transaction?: Transaction
  ) {
    const bookingLog = await db.BookingLog.create(
      {
        bookingId,
        userId,
        action,
        amountPaid,
        transactionDate: new Date(),
      },
      { transaction }
    );
    return bookingLog;
  }
}

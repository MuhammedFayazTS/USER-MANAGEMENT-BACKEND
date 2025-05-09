import { Op, Sequelize, Transaction } from "sequelize";
import db from "../../database/database";

type BookingStatus = "booked" | "checked-in" | "checked-out" | "cancelled";
export type PaymentType = "advance" | "final" | "refund" | "other";

export function mapPaymentType(status: BookingStatus): PaymentType {
  switch (status) {
    case "booked":
      return "advance";
    case "checked-in":
      return "final";
    case "checked-out":
      return "other";
    case "cancelled":
      return "refund";
    default:
      return "other";
  }
}

export async function getAmountPaid(
  bookingId: number,
  transaction?: Transaction
) {
  const result = await db.Payment.findOne({
    where: {
      bookingId,
      paymentType: {
        [Op.ne]: "refund",
      },
    },
    attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "amountPaid"]],
    raw: true,
    transaction,
  });

  return +(result?.amountPaid ?? 0);
}

export async function updateAmountPaid(
  bookingId: number,
  transaction: Transaction,
  lastTransactionAmount?: number
) {
  const amountPaid =
    (await getAmountPaid(bookingId)) + +(lastTransactionAmount ?? 0);
  const booking = await db.Booking.findOne({
    where: { id: bookingId },
    transaction,
  });

  if (!booking) {
    throw new Error(`Booking with id ${bookingId} not found.`);
  }

  booking.amountPaid = amountPaid;
  await booking.save({ transaction });

  return booking;
}

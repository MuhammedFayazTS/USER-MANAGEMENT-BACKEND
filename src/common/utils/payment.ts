import { Op, Sequelize, Transaction } from "sequelize";
import db from "../../database/database";

type BookingStatus = "booked" | "checked-in" | "checked-out" | "cancelled";
export type PaymentType = "advance" | "final" | "refund" | "other";

export function mapPaymentType(status: BookingStatus): PaymentType {
  switch (status) {
    case "booked":
      return "advance";
    case "checked-in":
      return "advance";
    case "checked-out":
      return "final";
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
  lastTransactionAmount?: number,
  isRefunded?: boolean
) {
  const amountPaid = isRefunded
    ? (await getAmountPaid(bookingId)) - +(lastTransactionAmount ?? 0)
    : (await getAmountPaid(bookingId)) + +(lastTransactionAmount ?? 0);
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

export async function validateFinalPayment(
  bookingId: number,
  paymentAmount: number,
  netAmount: number,
  transaction: Transaction
): Promise<void> {
  const existingAmountPaid = await getAmountPaid(bookingId, transaction);
  const totalPaid = existingAmountPaid + paymentAmount;

  if (totalPaid < netAmount) {
    throw new Error("Booking payment is still due.");
  }
  if (totalPaid > netAmount) {
    throw new Error("Payment exceeds the total net amount.");
  }
}

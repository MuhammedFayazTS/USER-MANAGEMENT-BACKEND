import { Sequelize, Transaction } from "sequelize";
import db from "../../database/database";
import { BookingAttributes } from "../../database/models/booking.model";
import { PaymentAttributes } from "../../database/models/payment.model";
import { assertDefined } from "../../common/utils/common";
import { mapPaymentType } from "../../common/utils/payment";

export class PaymentService {
  public async createPaymentFromBooking(
    bookingData: BookingAttributes,
    userId: number,
    transaction: Transaction
  ) {
    if (!bookingData) {
      throw new Error("Invalid booking data");
    }

    const bookingId = bookingData.id;
    const amount = bookingData.paymentAmount;
    const paymentModeId = bookingData.paymentModeId;
    const paidOn = bookingData.createdAt ?? new Date();
    const remarks = bookingData?.paymentRemarks;
    const paymentType =
      bookingData?.paymentType ?? mapPaymentType(bookingData.status);

    assertDefined(amount);
    assertDefined(bookingId);
    assertDefined(paymentModeId);

    const paymentParams: PaymentAttributes = {
      bookingId,
      amount,
      createdBy: userId,
      paymentType,
      paymentModeId,
      paidOn,
      ...(remarks ? { remarks } : {}),
    };

    const payment = await db.Payment.create(paymentParams, { transaction });
    if (!payment?.id) {
      throw new Error(
        `Error while processing payment for booking ID ${bookingId}`
      );
    }

    return payment;
  }

  public async getPaymentModesForSelect() {
    return await db.PaymentMode.findAll({
      attributes: [
        [Sequelize.literal('"PaymentMode"."id"'), "value"],
        [Sequelize.literal('"PaymentMode"."name"'), "label"],
      ],
      order: [["name", "ASC"]],
    });
  }
}

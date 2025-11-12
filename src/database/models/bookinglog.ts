"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

export type BookingActionType =
  | "booked"
  | "checked-in"
  | "checked-out"
  | "cancelled";

export interface BookingLogAttributes {
  bookingId: number;
  userId: number;
  action: BookingActionType;
  amountPaid: number;
  transactionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize) => {
  class BookingLog extends Model<BookingLogAttributes> {
    id?: number;
    bookingId!: number;
    userId!: number;
    action!: BookingActionType;
    amountPaid!: number;
    transactionDate!: Date;

    static associate(models: any) {
      BookingLog.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "booking",
      });
      BookingLog.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  BookingLog.init(
    {
      bookingId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      action: {
        type: DataTypes.ENUM(
          "booked",
          "checked-in",
          "checked-out",
          "cancelled"
        ),
        allowNull: false,
      },
      amountPaid: DataTypes.DECIMAL(10, 2),
      transactionDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BookingLog",
      paranoid: true,
    }
  );

  return BookingLog;
};

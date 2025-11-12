"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

export interface PaymentAttributes {
  id?: number;
  bookingId: number;
  amount: number;
  paymentType: "advance" | "final" | "refund" | "other";
  paymentModeId: number;
  paidOn: Date;
  remarks?: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Payment extends Model<PaymentAttributes> {
    id?: number;
    bookingId!: string;
    amount!: number;
    paymentType!: "advance" | "final" | "refund" | "other";
    paymentModeId!: number;
    paidOn!: Date;
    remarks?: string;
    createdBy!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      Payment.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "booking",
      });
      Payment.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "createdByUser",
      });
      Payment.belongsTo(models.PaymentMode, {
        foreignKey: "paymentModeId",
        as: "paymentMode",
      });
    }
  }

  Payment.init(
    {
      bookingId: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(10, 2),
      paymentType: {
        type: DataTypes.ENUM("advance", "final", "refund", "other"),
        allowNull: false,
      },
      paymentModeId: DataTypes.INTEGER,
      paidOn:DataTypes.DATE,
      remarks:DataTypes.TEXT,
      createdBy:DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt:DataTypes.DATE,
      deletedAt:  DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Payment",
      paranoid: true,
    }
  );

  return Payment;
};

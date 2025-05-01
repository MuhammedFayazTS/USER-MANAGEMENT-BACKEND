"use strict";
import { Model, Sequelize } from "sequelize";

export interface BookingAttributes {
  roomId: number;
  customerId: number;
  branchId: number;
  checkInDate: Date;
  checkOutDate: Date;
  actualCheckIn?: Date | null;
  actualCheckOut?: Date | null;
  status: "booked" | "checked-in" | "checked-out" | "cancelled";
  totalAmount: number;
  discount?: number | null;
  tax?: number | null;
  netAmount: number;
  notes?: string | null;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Booking extends Model<BookingAttributes> {
    id?: number;
    roomId!: number;
    customerId!: number;
    branchId!: number;
    checkInDate!: Date;
    checkOutDate!: Date;
    actualCheckIn?: Date | null;
    actualCheckOut?: Date | null;
    status!: "booked" | "checked-in" | "checked-out" | "cancelled";
    totalAmount!: number;
    discount?: number | null;
    tax?: number | null;
    netAmount!: number;
    notes?: string | null;
    createdBy!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      Booking.belongsTo(models.Room, {
        foreignKey: "roomId",
        as: "room",
      });
      Booking.belongsTo(models.Customer, {
        foreignKey: "customerId",
        as: "customer",
      });
      Booking.belongsTo(models.Branch, {
        foreignKey: "branchId",
        as: "branch",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "createdByUser",
      });
    }
  }
  Booking.init(
    {
      roomId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
      branchId: DataTypes.INTEGER,
      checkInDate: DataTypes.DATE,
      checkOutDate: DataTypes.DATE,
      actualCheckIn: DataTypes.DATE,
      actualCheckOut: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM(
          "booked",
          "checked-in",
          "checked-out",
          "cancelled"
        ),
        allowNull: false,
      },
      totalAmount: DataTypes.DECIMAL(10, 2),
      discount: DataTypes.DECIMAL(10, 2),
      tax: DataTypes.DECIMAL(10, 2),
      netAmount: DataTypes.DECIMAL(10, 2),
      notes: DataTypes.TEXT,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Booking",
      paranoid: true,
    }
  );
  return Booking;
};

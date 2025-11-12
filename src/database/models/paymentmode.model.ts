"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

export interface PaymentModeAttributes {
  id?: number;
  name: string;
  isActive: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class PaymentMode extends Model<PaymentModeAttributes> {
    id?: number;
    name!: string;
    isActive!: Boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {}
  }

  PaymentMode.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PaymentMode",
      paranoid: true,
    }
  );

  return PaymentMode;
};

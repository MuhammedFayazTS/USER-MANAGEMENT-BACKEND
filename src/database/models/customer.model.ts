"use strict";
import { Model, Sequelize } from "sequelize";

export interface CustomerAttributes {
  id?: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Customer extends Model<CustomerAttributes> {
    id?: number;
    firstName!: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      Customer.hasMany(models.CustomerIdProof, {
        foreignKey: "customerId",
        as: "idProofs"
      });
    }
  }

  Customer.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Customer",
      paranoid: true,
    }
  );

  return Customer;
};

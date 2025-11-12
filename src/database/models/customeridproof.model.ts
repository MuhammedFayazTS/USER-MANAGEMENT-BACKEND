"use strict";

import { Sequelize } from "sequelize";

const { Model } = require("sequelize");

export interface CustomerIdProofAttributes {
  id?: number;
  customerId: number;
  name: string;
  remarks?: string;
  document_file: string;
  document_file2?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class CustomerIdProof extends Model<CustomerIdProofAttributes> {
    id?: number;
    customerId!: number;
    name!: string;
    remarks?: string;
    document_file!: string;
    document_file2?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      CustomerIdProof.belongsTo(models.Customer, {
        foreignKey: "customerId",
        as: "customer",
      });
    }
  }

  CustomerIdProof.init(
    {
      customerId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      remarks: DataTypes.TEXT,
      document_file: DataTypes.STRING,
      document_file2: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CustomerIdProof",
      paranoid: true,
    }
  );

  return CustomerIdProof;
};

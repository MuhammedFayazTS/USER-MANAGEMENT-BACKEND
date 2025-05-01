"use strict";

import { Sequelize, Model } from "sequelize";

export interface BranchAttributes {
  id?: number;
  name: string;
  countryId: number;
  image?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Branch extends Model<BranchAttributes> {
    id?: number;
    name!: string;
    countryId!: number;
    image?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      Branch.belongsTo(models.Country, {
        foreignKey: "countryId",
      });
    }
  }

  Branch.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      countryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Branch",
      paranoid: true,
    }
  );

  return Branch;
};

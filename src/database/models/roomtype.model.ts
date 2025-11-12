"use strict";

import { Sequelize, Model } from "sequelize";

export interface RoomTypeAttributes {
  id?: number;
  name: string;
  branchId: number;
  description?: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class RoomType extends Model {
    id?: number;
    name!: string;
    description?: string;
    branchId!: number;
    price!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    static associate(models: any) {
      RoomType.belongsTo(models.Branch, {
        foreignKey: "branchId",
      });
    }
  }
  RoomType.init(
    {
      name: DataTypes.STRING,
      branchId: DataTypes.INTEGER,
      price: DataTypes.NUMERIC,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomType",
    }
  );
  return RoomType;
};

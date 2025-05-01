"use strict";

import { Sequelize, Model } from "sequelize";

export interface RoomStatusAttributes {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class RoomStatus extends Model<RoomStatusAttributes> {
    id?: number;
    name!: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    static associate(models: any) {
      // define association here
    }
  }
  RoomStatus.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomStatus",
      paranoid: true,
    }
  );
  return RoomStatus;
};

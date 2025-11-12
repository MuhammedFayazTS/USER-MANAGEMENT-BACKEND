"use strict";

import { Sequelize, Model } from "sequelize";

export interface RoomAttributes {
  id?: number;
  number: string;
  typeId: number;
  statusId: number;
  branchId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Room extends Model<RoomAttributes> {
    id?: number;
    number!: string;
    typeId!: number;
    statusId!: number;
    branchId!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      Room.belongsTo(models.Branch, {
        foreignKey: "branchId",
      });
      Room.belongsTo(models.RoomType, {
        foreignKey: "typeId",
        as: "type",
      });
      Room.belongsTo(models.RoomStatus, {
        foreignKey: "statusId",
        as: "status",
      });
    }
  }

  Room.init(
    {
      number: DataTypes.STRING,
      typeId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      branchId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Room",
      paranoid: true,
    }
  );

  return Room;
};

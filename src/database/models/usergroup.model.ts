"use strict";
import { Sequelize, Model } from "sequelize";

export interface UserGroupAttributes {
  id?: number;
  userId: number;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class UserGroup extends Model<UserGroupAttributes> {
    id?: number;
    userId!: number;
    groupId!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      UserGroup.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      UserGroup.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });
    }
  }
  UserGroup.init(
    {
      userId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserGroup",
      paranoid: true,
    }
  );
  return UserGroup;
};

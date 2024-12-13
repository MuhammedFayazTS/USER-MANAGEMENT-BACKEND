"use strict";

import { Sequelize, Model } from "sequelize";

export interface GroupAttributes {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Group extends Model<GroupAttributes> {
    id?: number;
    name!: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    static associate(models: any) {
      Group.belongsToMany(models.User, {
        through: models.UserGroup,
        foreignKey: "groupId",
        otherKey: "userId",
        as: "users",
      });
    }
  }
  Group.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Group",
      paranoid: true,
    }
  );
  return Group;
};

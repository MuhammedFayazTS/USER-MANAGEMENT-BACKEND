"use strict";

import { Sequelize, Model } from "sequelize";

export interface GroupRoleAttributes {
  id?: number;
  roleId: number;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class GroupRole extends Model<GroupRoleAttributes> {
    id?: number;
    roleId!: number;
    groupId!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    static associate(models: any) {
      GroupRole.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
      GroupRole.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });
    }
  }
  GroupRole.init(
    {
      roleId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GroupRole",
      paranoid: true,
    }
  );
  return GroupRole;
};

"use strict";

import { Sequelize, Model } from "sequelize";

export interface RolePermissionAttributes {
  id?: number;
  roleId: number;
  permissionId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class RolePermission extends Model {
    id?: number;
    roleId!: number;
    permissionId!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    static associate(models: any) {
      RolePermission.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        as: "permission",
      });
    }
  }
  RolePermission.init(
    {
      roleId: DataTypes.INTEGER,
      permisionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RolePermission",
    }
  );
  return RolePermission;
};

"use strict";

import { Sequelize, Model } from "sequelize";

export interface PermissionAttributes {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Permission extends Model<PermissionAttributes> {
    id?: number;
    name!: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    static associate(models: any) {
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: "permissionId",
        otherKey: "roleId",
        as: "role",
      });
      Permission.belongsToMany(models.Module, {
        through: models.ModulePermission,
        foreignKey: "permissionId",
        otherKey: "moduleId",
        as: "module",
      });
    }
  }
  Permission.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
      paranoid: true,
    }
  );
  return Permission;
};

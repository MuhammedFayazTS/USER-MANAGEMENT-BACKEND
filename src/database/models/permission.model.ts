"use strict";

import { Sequelize, Model } from "sequelize";

export interface PermissionAttributes {
  id?: number;
  name: string;
  moduleId: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Permission extends Model<PermissionAttributes> {
    id?: number;
    moduleId!: number;
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
        as: "roles",
      });
      Permission.belongsTo(models.Module, {
        foreignKey: "moduleId",
        as: "module",
      });
    }
  }
  Permission.init(
    {
      moduleId: DataTypes.INTEGER,
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

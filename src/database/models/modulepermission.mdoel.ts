"use strict";
import { Model, Sequelize } from "sequelize";

export interface ModulePermissionAttributes {
  id?: number;
  moduleId: number;
  permissionId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class ModulePermission extends Model<ModulePermissionAttributes> {
    id?: number;
    moduleId!: number;
    permissionId!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    static associate(models: any) {
      ModulePermission.belongsTo(models.Module, {
        foreignKey: "moduleId",
        as: "module",
      });
      ModulePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        as: "permission",
      });
    }
  }
  ModulePermission.init(
    {
      moduleId: DataTypes.INTEGER,
      permissionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ModulePermission",
    }
  );
  return ModulePermission;
};

"use strict";

import { Model, Sequelize } from "sequelize";

export interface ModuleAttributes {
  id?: number;
  name: string;
  type: string;
  slug: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Module extends Model<ModuleAttributes> {
    id?: number;
    type!: string;
    name!: string;
    slug!: string;
    isActive!: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    static associate(models: any) {
      Module.belongsToMany(models.Permission, {
        through: models.ModulePermission,
        foreignKey: "moduleId",
        otherKey: "permissionId",
        as: "permissions",
      });
    }
  }
  Module.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      slug: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Module",
    }
  );
  return Module;
};

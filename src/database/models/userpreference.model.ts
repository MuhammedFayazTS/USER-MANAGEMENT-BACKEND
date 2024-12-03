"use strict";

import { Sequelize } from "sequelize";

const { Model } = require("sequelize");

export interface UserPreferenceAttributes {
  id?: number;
  userId: number;
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class UserPreference extends Model<UserPreferenceAttributes> {
    id?: number;
    userId!: number;
    enable2FA!: boolean;
    emailNotification!: boolean;
    twoFactorSecret?: string;
    createdAt?: Date;
    updatedAt?: Date;
    static associate(models: any) {
      UserPreference.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  UserPreference.init(
    {
      userId: DataTypes.INTEGER,
      enable2FA: DataTypes.BOOLEAN,
      emailNotification: DataTypes.BOOLEAN,
      twoFactorSecret: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserPreference",
      paranoid: true,
    }
  );
  return UserPreference;
};

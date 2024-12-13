"use strict";

import { Model, Sequelize } from "sequelize";
import { compareValue, hashValue } from "../../common/utils/bcrypt";
import { UserPreferenceAttributes } from "./userpreference.model";

interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password?: string | null;
  isEmailVerified: boolean;
  origin?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userPreference?: UserPreferenceAttributes;
  externalUserId?:string
  comparePassword?: (password: string) => Promise<boolean>;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model {
    id?: number;
    name!: string;
    email!: string;
    password?: string | null;
    isEmailVerified!: boolean;
    origin?: string;
    externalUserId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {
      User.hasOne(models.UserPreference, {
        foreignKey: "userId",
        as: "userPreference",
      });
    }

    async comparePassword(value: string): Promise<boolean> {
      if (!this.password) {
        return false;
      }
      return compareValue(value, this.password);
    }

    toJSON() {
      const values = { ...this.get() }; // Get the instance data
      delete values.password; // Remove the password field from the JSON output
      if (values.userPreference) {
        delete values.userPreference.dataValues.twoFactorSecret; // Remove the twoFacoSecret
      }
      return values;
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isEmailVerified: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
      externalUserId: DataTypes.STRING,
      origin: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      timestamps: true,
      scopes: {
        withoutPassword: {
          attributes: {
            exclude: ["password"],
          },
        },
      },
      hooks: {
        beforeSave: async (user: User) => {
          if (user.changed("password") && user.password) {
            user.password = await hashValue(user.password, 10);
          } else if (!user.password) {
            user.password = null;
          }
        },
      },
    }
  );

  return User;
};

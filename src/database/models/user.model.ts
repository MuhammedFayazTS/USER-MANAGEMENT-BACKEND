"use strict";

import { Model, Sequelize } from "sequelize";
import { compareValue, hashValue } from "../../common/utils/bcrypt";

interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model {
    id?: number;
    name!: string;
    email!: string;
    password!: string;
    isEmailVerified!: boolean;
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
      return compareValue(value, this.password);
    }

    toJSON() {
      const values = { ...this.get() }; // Get the instance data
      delete values.password; // Remove the password field from the JSON output
      if(values.userPreference){
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
          if (user.changed("password")) {
            user.password = await hashValue(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};

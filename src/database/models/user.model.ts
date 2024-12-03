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
            exclude: ["password", "userPreference.twoFactorSecret"],
          },
          include: [
            {
              model: sequelize.models.UserPreference,
              as: "userPreference",
              attributes: { exclude: ["twoFactorSecret"] },
            },
          ],
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

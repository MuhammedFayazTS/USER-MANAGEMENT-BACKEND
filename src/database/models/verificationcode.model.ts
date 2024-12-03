"use strict";

import { Sequelize } from "sequelize";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { generateUniqueCode } from "../../common/utils/uuid";

const { Model } = require("sequelize");

export interface VerificationCodeAttributes {
  id?: number;
  userId: number;
  code?: string;
  type: VerificationEnum;
  expiresAt: Date;
  createdAt: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class VerificationCode extends Model<VerificationCodeAttributes> {
    id?: number;
    userId!: number;
    code?: string;
    type!: VerificationEnum;
    expiresAt!: Date;
    createdAt!: Date;
    static associate(models: any) {
      VerificationCode.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  VerificationCode.init(
    {
      userId: DataTypes.INTEGER,
      code: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
        defaultValue: generateUniqueCode,
      },
      type: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "VerificationCode",
    }
  );
  return VerificationCode;
};

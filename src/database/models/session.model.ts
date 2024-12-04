"use strict";

import { Sequelize } from "sequelize";
import { thirtyDaysFromNow } from "../../common/utils/date-time";

const { Model } = require("sequelize");

export interface SessionAttributes {
  id?: number;
  userId: number;
  userAgent?: string;
  expiredAt: Date;
  createdAt: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Session extends Model<SessionAttributes> {
    id?: number;
    userId!: number;
    userAgent?: string;
    expiredAt!: Date;
    createdAt!: Date;
    static associate(models:any) {
      Session.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Session.init(
    {
      userId: DataTypes.INTEGER,
      userAgent: DataTypes.STRING,
      expiredAt: {
        type: DataTypes.DATE,
        defaultValue: thirtyDaysFromNow,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
      },
    },
    {
      sequelize,
      modelName: "Session",
    }
  );
  return Session;
};

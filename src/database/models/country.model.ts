"use strict";
import { Model } from "sequelize";

export interface CountryAttributes {
  id?: number;
  code: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Country extends Model<CountryAttributes> {
    id?: number;
    code!: string;
    name!: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    static associate(models: any) {}
  }
  Country.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Country",
    }
  );
  return Country;
};

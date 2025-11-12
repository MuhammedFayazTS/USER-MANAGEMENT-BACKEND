import Sequelize from "sequelize";
import db from "../../database/database";

export class CountryService {
  public async getCountriesForSelect() {
    const countries = await db.Country.findAll({
      attributes: [
        [Sequelize.literal('"Country"."id"'), "value"],
        [Sequelize.literal('"Country"."name"'), "label"],
      ],
      order: [["name", "ASC"]],
    });
    return countries;
  }
}

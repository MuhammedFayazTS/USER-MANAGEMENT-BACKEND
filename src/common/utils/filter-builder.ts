import { Op } from "sequelize";
import { DefaultQueryParams } from "../interfaces/query.interface";

export class FilterBuilder {
  private queryParams: DefaultQueryParams;
  private searchFields: Array<string>;

  constructor(query: DefaultQueryParams, searchFields: Array<string> = []) {
    this.queryParams = query;
    this.searchFields = searchFields;
  }

  buildFilters() {
    if (!this.queryParams) {
      return {
        order: [["id", "DESC"]],
        limit: 10,
        attributes: undefined,
        where: {},
      };
    }

    const {
      order: queryOrder = "DESC",
      sort = "id",
      limit = 10,
      attributes,
      search,
      isActive,
    } = this.queryParams;

    const order = [[sort, queryOrder]]; // Order by column and direction
    const where: any = {};

    // Build search conditions
    if (search && this.searchFields.length > 0) {
      const searchConditions = this.searchFields.map((field) => ({
        [field]: { [Op.like]: `%${search}%` },
      }));
      where[Op.or] = searchConditions;
    }

    if (isActive) {
      where.isActive = isActive;
    }

    return { order, limit: Number(limit), attributes, where };
  }
}

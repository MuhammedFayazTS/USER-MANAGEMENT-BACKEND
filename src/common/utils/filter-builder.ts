import { Op, Sequelize } from "sequelize";
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
      sort = "id.DESC",
      limit = 10,
      page = 1,
      attributes,
      search,
      isActive,
    } = this.queryParams;

    const sortArray = sort.split(".");

    const order = [[sortArray[0], sortArray[1]]]; // Order by column and direction
    const where: any = {};
    
    // Build search conditions
    if (search && this.searchFields.length > 0) {
      const searchConditions = this.searchFields.map((field) => ({
        [field]: {
          [Op.iLike]: `%${search.toLowerCase()}%`,  // Case-insensitive search
        },
      }));
      where[Op.or] = searchConditions;
    }

    if (isActive) {
      where.isActive = isActive;
    }

    const offset = (+page - 1) * limit;

    return { order, limit: Number(limit), attributes, where, offset };
  }
}

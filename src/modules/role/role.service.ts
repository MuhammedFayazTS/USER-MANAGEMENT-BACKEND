import Sequelize from "sequelize";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import db from "../../database/database";
import { RoleAttributes } from "../../database/models/role.model";
import { FilterBuilder } from "../../common/utils/filter-builder";
import { NotFoundException } from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";

export class RoleService {
  public async getAllRoles(
    query: DefaultQueryParams,
    skip?: number | undefined
  ) {
    const filterBuilder = new FilterBuilder(query, ["name", "description"]);
    const { order, where, limit, attributes } = filterBuilder.buildFilters();
    const roles = await db.Role.findAndCountAll({
      where,
      attributes: attributes || ["id", "name", "description"],
      order,
      limit,
      offset: skip,
    });

    return roles;
  }

  public async getRolesForSelect() {
    const roles = await db.Role.findAll({
      attributes: [
        [Sequelize.literal('"Role"."id"'), "value"],
        [Sequelize.literal('"Role"."name"'), "label"],
      ],
      order: [["name", "ASC"]],
    });
    return roles;
  }

  public async getRole(id: number | string) {
    const role = await db.Role.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(
        "User does not exist",
        ErrorCode.RESOURCE_NOT_FOUND
      );
    }

    return role;
  }

  public async createRole(role: RoleAttributes) {
    return await db.Role.create(role);
  }

  public async updateRole(id: number | string, newRole: RoleAttributes) {
    const existingRole = await db.Role.findOne({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundException(
        "User does not exist",
        ErrorCode.RESOURCE_NOT_FOUND
      );
    }

    await existingRole.update(newRole);
  }

  public async deleteRole(id: number | string) {
    const deletedRole = await db.Role.destroy({
      where: { id },
    });

    return deletedRole;
  }
}

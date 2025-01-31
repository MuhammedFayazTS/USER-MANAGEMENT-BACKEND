import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import db from "../../database/database";
import { FilterBuilder } from "../../common/utils/filter-builder";
import { NotFoundException } from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { assertDefined } from "../../common/utils/common";
import { NewGroup } from "../../common/interfaces/group.interface";
import { RoleAttributes } from "../../database/models/role.model";
import { Sequelize, Transaction } from "sequelize";
import { GroupRoleAttributes } from "../../database/models/grouprole.model";

export class GroupService {
  public async getAllGroups(query: DefaultQueryParams) {
    const filterBuilder = new FilterBuilder(query, ["name", "description"]);
    const { order, where, limit, attributes, offset } =
      filterBuilder.buildFilters();
    const groups = await db.Group.findAndCountAll({
      where,
      attributes: attributes || ["id", "name", "description"],
      include: [
        {
          model: db.Role,
          attributes: ["id", "name", "description"],
          as: "roles",
        },
        {
          model: db.User,
          attributes: ["id", "firstName", "lastName", "image", "email"],
          as: "users",
        },
      ],
      order,
      limit,
      offset,
    });

    return groups;
  }

  public async getGroup(id: number | string) {
    const group = await db.Group.findOne({
      where: { id },
      include: [
        {
          model: db.Role,
          attributes: ["id", "name", "description"],
          as: "roles",
        },
        {
          model: db.User,
          attributes: ["id", "firstName", "lastName", "image", "email"],
          as: "users",
        },
      ],
    });

    if (!group) {
      throw new NotFoundException(
        "Group does not exist",
        ErrorCode.GROUP_NOT_FOUND
      );
    }

    return group;
  }

  public async getGroupsForSelect() {
    const groups = await db.Group.findAll({
      attributes: [
        [Sequelize.literal('"Group"."id"'), "value"],
        [Sequelize.literal('"Group"."name"'), "label"],
      ],
      order: [["name", "ASC"]],
    });
    return groups;
  }

  public async createGroup(group: NewGroup) {
    const transaction = await db.createDBTransaction();

    try {
      const newGroup = await db.Group.create(group, { transaction });

      const { roles } = group;
      if (roles && roles.length > 0) {
        await this.insertGroupRole(newGroup.id, roles, transaction);
      }

      await transaction.commit();

      return newGroup;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateGroup(id: number | string, newGroup: NewGroup) {
    const transaction = await db.createDBTransaction();

    try {
      const existingGroup = await db.Group.findOne({
        where: { id },
      });

      if (!existingGroup) {
        throw new NotFoundException(
          "Group does not exist",
          ErrorCode.GROUP_NOT_FOUND
        );
      }

      await existingGroup.update(newGroup, { transaction });

      const { roles } = newGroup;
      if (roles && roles.length > 0) {
        await this.insertGroupRole(existingGroup.id, roles, transaction);
      }

      await transaction.commit();
      return existingGroup;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async deleteGroup(id: number | string) {
    const deletedGroup = await db.Group.destroy({
      where: { id },
    });

    return deletedGroup;
  }

  public async addRoleToGroup(groupId: number, roleId: number) {
    await db.GroupRole.create({ groupId, roleId });
  }

  public async removeRoleFromGroup(groupId: number, roleId: number) {
    await db.GroupRole.destroy({
      where: { groupId, roleId },
    });
  }

  public async getGroupRoles(groupId: number) {
    const groupRoles = await db.GroupRole.findAll({
      where: { groupId },
      include: [
        {
          model: db.Role,
          attributes: ["id", "name", "description"],
          as: "role",
        },
      ],
    });

    return groupRoles;
  }

  private async insertGroupRole(
    groupId: number,
    roles: RoleAttributes[],
    transaction: Transaction
  ) {
    if (!groupId) return;
  
    const existingGroupRoles = await db.GroupRole.findAll({
      where: { groupId },
      transaction,
    });
  
    const newRoles = roles.filter(
      (role) =>
        !existingGroupRoles.some(
          (existingRole:GroupRoleAttributes) => existingRole.roleId === role.id
        )
    );
  
    const groupRoleIds = newRoles.map((role) => ({
      groupId,
      roleId: role.id,
    }));
  
    if (groupRoleIds.length > 0) {
      await db.GroupRole.bulkCreate(groupRoleIds, { transaction });
    }
  }
}

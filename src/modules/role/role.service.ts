import Sequelize from "sequelize";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import db from "../../database/database";
import { RoleAttributes } from "../../database/models/role.model";
import { FilterBuilder } from "../../common/utils/filter-builder";
import {
  NotFoundException,
  PermissionNotFoundException,
  RoleDeleteNotAllowedException,
} from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { UpdateRolePermissionInput } from "../../common/interfaces/permission.interface";
import { PermissionAttributes } from "../../database/models/permission.model";
import { RolePermissionAttributes } from "../../database/models/rolepermission.model";

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
        "Role does not exist",
        ErrorCode.ROLE_NOT_FOUND
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
        "Role does not exist",
        ErrorCode.ROLE_NOT_FOUND
      );
    }

    await existingRole.update(newRole);
  }

  public async deleteRole(id: number | string) {
    const usage = await this.checkRoleUsage(id);
    if (usage) {
      throw new RoleDeleteNotAllowedException();
    }
    const deletedRole = await db.Role.destroy({
      where: { id },
    });

    return deletedRole;
  }

  public async updateRolePermissions(
    roleId: string,
    request: UpdateRolePermissionInput
  ): Promise<PermissionAttributes[]> {
    const transaction = await db.createDBTransaction();
    try {
      const role = await this.getRole(roleId);
      if (!role) {
        throw new NotFoundException(
          "Role not found.",
          ErrorCode.ROLE_NOT_FOUND
        );
      }

      const existingRolePermissions = await this.getRolePermissions(roleId);
      const permissionsInRequest = (await db.Permission.findAll({
        where: { id: request.permissions },
      })) as unknown as PermissionAttributes[];

      const validPermissions = new Set(permissionsInRequest.map((p) => p.id));
      if (permissionsInRequest.length !== request.permissions.length) {
        const notFoundId = request.permissions
          .filter((p) => !validPermissions.has(+p))
          .toString();

        throw new PermissionNotFoundException(
          `Permission ${notFoundId} not found.`
        );
      }

      const permissionsToBeRemoved = existingRolePermissions
        .filter((p) => !validPermissions.has(p.id))
        .map((p) => ({ roleId: roleId, permissionId: p.id }));

      if (permissionsToBeRemoved.length > 0) {
        await db.RolePermission.destroy({
          where: {
            roleId: roleId,
            permissionId: permissionsToBeRemoved.map((p) => p.permissionId),
          },
          transaction,
        });
      }

      const newPermissions = request.permissions.map((permissionId) => ({
        roleId: roleId,
        permissionId: permissionId,
      }));

      await db.RolePermission.bulkCreate(newPermissions);

      const updatedRolePermissions = await this.getRolePermissions(roleId);
      return updatedRolePermissions;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  public async getRolePermissions(
    roleId: string
  ): Promise<PermissionAttributes[]> {
    const rolePermissions = await db.Permission.findAll({
      include: {
        model: db.Role,
        where: { id: roleId },
        through: {
          attributes: [],
        },
        as: "role",
      },
    });
    return rolePermissions;
  }

  private async checkRoleUsage(roleId: number | string): Promise<boolean> {
    const roleCount = await db.RolePermission.count({
      where: { roleId },
    });
    const groupRoleCount = await db.GroupRole.count({
      where: { roleId },
    });
    const userRole = await db.User.count({
      where: { roleId },
    });
    return roleCount + groupRoleCount + userRole > 0;
  }
}

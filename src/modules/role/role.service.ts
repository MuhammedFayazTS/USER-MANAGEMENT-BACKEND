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
import { NewRole } from "../../common/interfaces/role.interface";
import { assertDefined } from "../../common/utils/common";

export class RoleService {
  public async getAllRoles(
    query: DefaultQueryParams,
    skip?: number | undefined
  ) {
    const filterBuilder = new FilterBuilder(query, ["name", "description"]);
    const { order, where, limit, attributes, offset } =
      filterBuilder.buildFilters();
    const roles = await db.Role.findAndCountAll({
      where,
      attributes: attributes || ["id", "name", "description"],
      include: [
        {
          model: db.Permission,
          attributes: ["name", "description"],
          as: "permissions",
        },
      ],
      order,
      limit,
      offset,
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
      include: [
        {
          model: db.Permission,
          attributes: ["id", "name", "description"],
          as: "permissions",
        },
      ],
    });

    if (!role) {
      throw new NotFoundException(
        "Role does not exist",
        ErrorCode.ROLE_NOT_FOUND
      );
    }

    return role;
  }

  public async createRole(role: NewRole) {
    const newRole = await db.Role.create(role);
    assertDefined(newRole.id, "Role does not exist");
    await this.insertRolePermissions(role.permissions, newRole.id);
    return this.getRolePermissions(newRole.id);
  }

  public async updateRole(id: number | string, newRole: NewRole) {
    const existingRole = await db.Role.findOne({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundException(
        "Role does not exist",
        ErrorCode.ROLE_NOT_FOUND
      );
    }

    await this.insertRolePermissions(newRole.permissions, id);
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
    roleId: number | string,
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

      const existingRolePermissions = await this.getRolePermissions(+roleId);
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

      const updatedRolePermissions = await this.getRolePermissions(+roleId);
      return updatedRolePermissions;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  public async getRolePermissions(
    roleId: number
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

  private insertRolePermissions = async (
    permissions: PermissionAttributes[] | [],
    roleId: string | number
  ) => {
    if (!roleId) return;

    const permissionIds = permissions
      ?.map((permission) => permission.id)
      .filter((id): id is number => id !== undefined && id !== null);

    if (!permissionIds || permissionIds.length === 0) return this.deleteRolePermissionsByRoleId(roleId);

    await this.updateRolePermissions(roleId, {
      permissions: permissionIds,
    });
  };

  private async deleteRolePermissionsByRoleId(roleId: string | number) {
    await db.RolePermission.destroy({
      where: {
        roleId,
      },
    });
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

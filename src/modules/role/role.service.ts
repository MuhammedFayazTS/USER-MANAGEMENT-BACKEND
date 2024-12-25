import Sequelize from "sequelize";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import db from "../../database/database";
import { RoleAttributes } from "../../database/models/role.model";
import { FilterBuilder } from "../../common/utils/filter-builder";
import { NotFoundException } from "../../common/utils/catch-errors";
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

  // Method to update role permissions
  public async updateRolePermissions(
    roleId: string,
    request: UpdateRolePermissionInput
  ): Promise<PermissionAttributes[]> {
    // Ensure role exists
    const role = await this.getRole(roleId);
    if (!role) {
      throw new NotFoundException("Role not found.");
    }

    // Get the role's existing permissions
    const existingRolePermissions = await this.getRolePermissions(roleId);
    const permissionsInRequest = await db.Permission.findAll({
      where: { id: request.permissions },
    }) as unknown as PermissionAttributes[];

    // Validate that all requested permissions exist
    const validPermissions = new Set(permissionsInRequest.map((p) => p.id));
    if (permissionsInRequest.length !== request.permissions.length) {
    const notFoundId = request.permissions.filter((p) => !validPermissions.has(p)).toString()

      throw new NotFoundException(
        `Permission ${notFoundId} not found.`
      );
    }

    // Permissions to remove from the role
    const permissionsToBeRemoved = existingRolePermissions
      .filter((p) => !validPermissions.has(p.id))
      .map((p) => ({ roleId: roleId, permissionId: p.id }));

    // Remove the old role permissions
    if (permissionsToBeRemoved.length > 0) {
      await db.RolePermission.destroy({
        where: {
          roleId: roleId,
          permissionId: permissionsToBeRemoved.map((p) => p.permissionId),
        },
      });
    }

    // Add new role permissions
    const newPermissions = request.permissions.map((permissionId) => ({
      roleId: roleId,
      permissionId: permissionId,
    }));

    // Create new role permissions
    await db.RolePermission.bulkCreate(newPermissions);

    // Get the updated permissions for the role
    const updatedRolePermissions = await this.getRolePermissions(roleId);
    return updatedRolePermissions;
  }

  // Method to get role permissions
  private async getRolePermissions(
    roleId: string
  ): Promise<PermissionAttributes[]> {
    const rolePermissions = await db.Permission.findAll({
      include: {
        model: db.RolePermission,
        where: { roleId },
        attributes: ["permissionId"],
      },
    });
    return rolePermissions;
  }
}

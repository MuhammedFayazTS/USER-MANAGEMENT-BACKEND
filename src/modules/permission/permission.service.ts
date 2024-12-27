import {
  PermissionDeleteNotAllowedException,
  PermissionNotFoundException,
} from "../../common/utils/catch-errors";
import db from "../../database/database";
import { PermissionAttributes } from "../../database/models/permission.model";

export class PermissionService {
  async getAllPermissions(): Promise<PermissionAttributes[]> {
    return await db.Permission.findAll({});
  }

  async getOnePermission(id: number | string): Promise<PermissionAttributes> {
    const permission = await db.Permission.findOne({ where: { id } });
    if (!permission) {
      throw new PermissionNotFoundException("Permission Not Found");
    }
    return permission;
  }

  async createPermission(data: any): Promise<PermissionAttributes> {
    return await db.Permission.create(data);
  }

  async updatePermission(
    id: number | string,
    updates: any
  ): Promise<PermissionAttributes> {
    const permission = await db.Permission.findOne({ where: { id } });
    if (!permission) {
      throw new PermissionNotFoundException("Permission Not Found");
    }
    await permission.update(updates);
    return permission;
  }

  async deletePermission(id: number | string): Promise<void> {
    const permission = await db.Permission.findOne({ where: { id } });
    if (!permission) {
      throw new PermissionNotFoundException("Permission Not Found");
    }

    if (await this.checkPermissionUsage(id)) {
      throw new PermissionDeleteNotAllowedException();
    }

    await db.Permission.destroy({ where: { id } });
  }

  private async checkPermissionUsage(
    permissionId: number | string
  ): Promise<boolean> {
    const roleCount = await db.RolePermission.count({
      where: { permissionId },
    });
    const moduleCount = await db.ModulePermission.count({
      where: { permissionId },
    });
    return roleCount + moduleCount > 0;
  }
}

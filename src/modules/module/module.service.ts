import { ErrorCode } from "../../common/enums/error-code.enum";
import { UpdateModulePermissionInput } from "../../common/interfaces/permission.interface";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import {
  ModuleDeleteNotAllowedException,
  NotFoundException,
  PermissionNotFoundException,
} from "../../common/utils/catch-errors";
import { FilterBuilder } from "../../common/utils/filter-builder";
import db from "../../database/database";
import { ModuleAttributes } from "../../database/models/module.model";
import { PermissionAttributes } from "../../database/models/permission.model";

export class ModuleService {
  public async getAllModules(
    query: DefaultQueryParams,
    skip?: number | undefined
  ) {
    const filterBuilder = new FilterBuilder(query, ["name", "slug", "type"]);
    const { order, where, limit, attributes } = filterBuilder.buildFilters();
    const modules = await db.Module.findAndCountAll({
      where,
      attributes: attributes || ["id", "name", "slug", "type", "isActive"],
      include: [
        {
          model: db.Permission,
          attributes: ["id", "name", "description"],
          as: "permissions",
        },
      ],
      order,
      limit,
      offset: skip,
    });

    return modules;
  }

  public async getModule(id: number | string) {
    const module = await db.Module.findOne({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(
        "Module does not exist",
        ErrorCode.MODULE_NOT_FOUND
      );
    }

    return module;
  }

  public async getModulePermissions(
    moduleId: number | string
  ): Promise<PermissionAttributes[]> {
    const modulePermissions = await db.Permission.findAll({
      include: {
        model: db.Module,
        where: { id: moduleId },
        through: {
          attributes: [],
        },
        as: "module",
      },
    });
    return modulePermissions;
  }

  public async createModule(module: ModuleAttributes) {
    return await db.Module.create(module);
  }

  public async updateModule(id: number | string, module: ModuleAttributes) {
    const existingModule = await db.Module.findOne({
      where: { id },
    });

    if (!existingModule) {
      throw new NotFoundException(
        "Module does not exist",
        ErrorCode.MODULE_NOT_FOUND
      );
    }

    await existingModule.update(module);
  }

  public async updateModulePermissions(
    moduleId: string,
    request: UpdateModulePermissionInput
  ): Promise<PermissionAttributes[]> {
    const transaction = await db.createDBTransaction();
    try {
      const module = await this.getModule(moduleId);
      if (!module) {
        throw new NotFoundException(
          "Module not found.",
          ErrorCode.MODULE_NOT_FOUND
        );
      }

      const existingModulePermissions =
        await this.getModulePermissions(moduleId);
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

      const permissionsToBeRemoved = existingModulePermissions
        .filter((p) => !validPermissions.has(p.id))
        .map((p) => ({ moduleId: moduleId, permissionId: p.id }));

      if (permissionsToBeRemoved.length > 0) {
        await db.ModulePermission.destroy({
          where: {
            moduleId: moduleId,
            permissionId: permissionsToBeRemoved.map((p) => p.permissionId),
          },
          transaction,
        });
      }

      const newPermissions = request.permissions.map((permissionId) => ({
        moduleId: moduleId,
        permissionId: permissionId,
      }));

      await db.ModulePermission.bulkCreate(newPermissions);

      const updatedModulePermissions =
        await this.getModulePermissions(moduleId);
      return updatedModulePermissions;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  public async deleteModule(id: number | string) {
    const usage = await this.checkModuleUsage(id);
    if (usage) {
      throw new ModuleDeleteNotAllowedException();
    }
    const deletedModule = await db.Module.destroy({
      where: { id },
    });

    return deletedModule;
  }

  private async checkModuleUsage(moduleId: number | string): Promise<boolean> {
    const moduleCount = await db.ModulePermission.count({
      where: { moduleId },
    });
    return moduleCount > 0;
  }
}

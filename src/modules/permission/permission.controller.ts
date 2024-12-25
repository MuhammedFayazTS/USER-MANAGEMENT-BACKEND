import { Request, Response } from "express";
import { HTTPSTATUS } from "../../config/http.config";
import { PermissionService } from "./permission.service";
import { asyncHandler } from "../../middleware/asyncHandler";
import { assertDefined } from "../../common/utils/common";
import { permissionSchema } from "../../common/validators/permission.validator";

export class PermissionController {
  private permissionService: PermissionService;

  constructor(permissionService: PermissionService) {
    this.permissionService = permissionService;
  }

  public getAllPermissions = asyncHandler(
    async (req: Request, res: Response) => {
      const permissions = await this.permissionService.getAllPermissions();

      return res.status(HTTPSTATUS.OK).json({
        message: "All permissions are listed successfully",
        permissions,
      });
    }
  );

  public getOnePermission = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      assertDefined(id, "Permission id is not defined");

      const permission = await this.permissionService.getOnePermission(id);

      return res.status(HTTPSTATUS.OK).json({
        message: "Permission retrieved successfully",
        permission,
      });
    }
  );

  public createPermission = asyncHandler(
    async (req: Request, res: Response) => {
      const permissionData = permissionSchema.parse(req.body);
      const permission =
        await this.permissionService.createPermission(permissionData);

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Permission created successfully",
        permission,
      });
    }
  );

  public updatePermission = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      assertDefined(id, "Permission id is not defined");
      const { name, description } = permissionSchema.parse(req.body);

      const permission = await this.permissionService.updatePermission(id, {
        name,
        description,
      });

      return res.status(HTTPSTATUS.OK).json({
        message: "Permission updated successfully",
        permission,
      });
    }
  );

  public deletePermission = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      assertDefined(id, "Pemrission id does not exist");

      await this.permissionService.deletePermission(id);

      return res.status(HTTPSTATUS.OK).json({
        message: "Permission deleted successfully",
      });
    }
  );
}

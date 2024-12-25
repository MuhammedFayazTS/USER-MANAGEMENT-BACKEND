import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { RoleService } from "./role.service";
import { rolePermissionSchema, roleSchema } from "../../common/validators/role.validatior";
import { HTTPSTATUS } from "../../config/http.config";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";

export class RoleController {
  private roleService: RoleService;
  constructor(roleService: RoleService) {
    this.roleService = roleService;
  }

  public createRole = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = roleSchema.parse(req.body);

    const role = await this.roleService.createRole({ name, description });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Role created successfully",
      role,
    });
  });

  public updateRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Role id is not defined");
    const { name, description } = roleSchema.parse(req.body);

    const role = await this.roleService.updateRole(id, { name, description });

    return res.status(HTTPSTATUS.OK).json({
      message: "Role updated successfully",
      role,
    });
  });

  public getRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Role id is not defined");

    const role = await this.roleService.getRole(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Role retrieved successfully",
      role,
    });
  });

  public getAllRoles = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;

    const roles = await this.roleService.getAllRoles(query);

    return res.status(HTTPSTATUS.OK).json({
      message: "All roles are listed successfully",
      roles,
      ...getPaginationInfo(req, roles.count),
    });
  });

  public getRolesForSelect = asyncHandler(
    async (req: Request, res: Response) => {
      const roles = await this.roleService.getRolesForSelect();

      return res.status(HTTPSTATUS.OK).json({
        message: "All roles for select are listed successfully",
        roles,
      });
    }
  );

  public deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Role id does not exist");

    await this.roleService.deleteRole(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Role deleted successfully",
    });
  });

  public updateRolePermissions = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      assertDefined(id, "Role id does not exist");
      const body = rolePermissionSchema.parse(req.body);
      const updatedRolePermissions = await this.roleService.updateRolePermissions(
        id,
        body
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Role permissions updated successfully",
        permissions:updatedRolePermissions,
      });
    }
  );
  
}

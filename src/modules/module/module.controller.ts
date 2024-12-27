import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { ModuleService } from "./module.service";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";
import { HTTPSTATUS } from "../../config/http.config";
import { moduleSchema } from "../../common/validators/module.validator";

export class ModuleController {
  private moduleService: ModuleService;

  constructor(moduleService: ModuleService) {
    this.moduleService = moduleService;
  }

  public getAllModule = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;

    const modules = await this.moduleService.getAllModules(query);

    return res.status(HTTPSTATUS.OK).json({
      message: "All modules retrieved successfully",
      modules,
      ...getPaginationInfo(req, modules.count),
    });
  });

  public getModulePermissions = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      assertDefined(id, "Module ID not defined");

      const permissions = await this.moduleService.getModulePermissions(id);

      return res.status(HTTPSTATUS.OK).json({
        message: "Module permissions retrieved successfully",
        permissions,
      });
    }
  );

  public getModule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Module ID not defined");

    const module = await this.moduleService.getModule(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Module retrieved successfully",
      module,
    });
  });

  public createModule = asyncHandler(async (req: Request, res: Response) => {
    const moduleData = req.body;

    const { isActive, name, slug, type } = moduleSchema.parse(req.body);
    const module = await this.moduleService.createModule({
      isActive,
      name,
      slug,
      type,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Module created successfully",
      module,
    });
  });

  public updateModulePermissions = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      assertDefined(id, "Module ID not defined");

      const body = req.body;
      const updatedPermissions =
        await this.moduleService.updateModulePermissions(id, body);

      return res.status(HTTPSTATUS.OK).json({
        message: "Module permissions updated successfully",
        permissions: updatedPermissions,
      });
    }
  );

  public updateModule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Module ID not defined");

    const { isActive, name, slug, type } = moduleSchema.parse(req.body);
    const module = await this.moduleService.updateModule(id, {
      isActive,
      name,
      slug,
      type,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Module updated successfully",
      module,
    });
  });

  public deleteModule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Module ID not defined");

    await this.moduleService.deleteModule(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Module deleted successfully",
    });
  });
}

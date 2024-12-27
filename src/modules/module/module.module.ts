import { ModuleController } from "./module.controller";
import { ModuleService } from "./module.service";

const moduleService = new ModuleService();
const moduleController = new ModuleController(moduleService);

export { moduleService, moduleController };

import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";


const permissionService = new PermissionService();
const permissionController = new PermissionController(permissionService);

export { permissionService, permissionController };

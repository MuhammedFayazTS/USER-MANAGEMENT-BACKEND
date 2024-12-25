import { Router } from "express";
import { permissionController } from "./permission.module";

const roleRoutes = Router();

roleRoutes.get("/", permissionController.getAllPermissions);
roleRoutes.get("/:id", permissionController.getOnePermission);
roleRoutes.post("/", permissionController.createPermission);
roleRoutes.put("/:id", permissionController.updatePermission);
roleRoutes.delete("/:id", permissionController.deletePermission);

export default roleRoutes;

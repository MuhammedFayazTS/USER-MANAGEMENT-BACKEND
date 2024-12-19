import { Router } from "express";
import { roleController } from "./role.module";

const roleRoutes = Router();

roleRoutes.get("/", roleController.getAllRoles);
roleRoutes.get("/select", roleController.getRolesForSelect);
roleRoutes.get("/:id", roleController.getRole);
roleRoutes.post("/", roleController.createRole);
roleRoutes.put("/:id", roleController.updateRole);
roleRoutes.delete("/:id", roleController.deleteRole);

export default roleRoutes;

import { Router } from "express";
import { moduleController } from "./module.module";

const roleRoutes = Router();

roleRoutes.get("/", moduleController.getAllModule);
roleRoutes.get("/permissions/:id", moduleController.getModulePermissions);
roleRoutes.get("/:id", moduleController.getModule);
roleRoutes.post("/", moduleController.createModule);
roleRoutes.put("/permissions/:id", moduleController.updateModulePermissions);
roleRoutes.put("/:id", moduleController.updateModule);
roleRoutes.delete("/:id", moduleController.deleteModule);

export default roleRoutes;

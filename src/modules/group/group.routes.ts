import { Router } from "express";
import { groupController } from "./group.module";

const roleRoutes = Router();

roleRoutes.get("/", groupController.getAllGroups);
roleRoutes.get("/select", groupController.getGroupsForSelect);
roleRoutes.get("/roles/:groupId", groupController.getGroupRoles);
roleRoutes.get("/:id", groupController.getGroup);
roleRoutes.post("/", groupController.createGroup);
roleRoutes.put("/roles/add/:groupId/:roleId", groupController.addRoleToGroup);
roleRoutes.delete("/roles/delete/:groupId/:roleId", groupController.removeRoleFromGroup);
roleRoutes.put("/users/add/:groupId/:userId", groupController.addUserToGroup);
roleRoutes.delete("/users/delete/:groupId/:userId", groupController.removeUserFromGroup);
roleRoutes.put("/:id", groupController.updateGroup);
roleRoutes.delete("/:id", groupController.deleteGroup);

export default roleRoutes;

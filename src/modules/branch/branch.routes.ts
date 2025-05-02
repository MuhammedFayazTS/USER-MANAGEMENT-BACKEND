import { Router } from "express";
import { branchController } from "./branch.module";

const branchRoutes = Router();

branchRoutes.get("/", branchController.getAllBranches);
branchRoutes.get("/select", branchController.getBranchesForSelect);
branchRoutes.get("/:id", branchController.getBranch);
branchRoutes.post("/", branchController.createBranch);
branchRoutes.put("/:id", branchController.updateBranch);
branchRoutes.delete("/:id", branchController.deleteBranch);

export default branchRoutes;

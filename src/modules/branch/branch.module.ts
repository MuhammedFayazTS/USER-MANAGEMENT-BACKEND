import { BranchController } from "./branch.controller";
import { BranchService } from "./branch.service";

const branchService = new BranchService();
const branchController = new BranchController(branchService);

export { branchService, branchController };

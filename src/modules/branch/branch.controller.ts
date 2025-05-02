import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { BranchService } from "./branch.service";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";
import { branchSchema } from "../../common/validators/branch.validator";

export class BranchController {
  private branchService: BranchService;
  constructor(countryService: BranchService) {
    this.branchService = countryService;
  }

  public getBranch = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Branch id is not defined");

    const branch = await this.branchService.getBranch(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Branch retrieved successfully",
      branch,
    });
  });

  public getAllBranches = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;

    const branches = await this.branchService.getAllBranches(query);

    return res.status(HTTPSTATUS.OK).json({
      message: "All branches are listed successfully",
      branches,
      ...getPaginationInfo(req, branches.count),
    });
  });

  public getBranchesForSelect = asyncHandler(
    async (req: Request, res: Response) => {
      const branches = await this.branchService.getRolesForSelect();

      return res.status(HTTPSTATUS.OK).json({
        message: "All branches for select are listed successfully",
        branches,
      });
    }
  );

  public createBranch = asyncHandler(async (req: Request, res: Response) => {
    const branchData = branchSchema.parse(req.body);

    const branch = await this.branchService.createBranch(branchData);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Branch created successfully",
      branch,
    });
  });

  public updateBranch = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Branch id is not defined");

    const branchData = branchSchema.partial().parse(req.body); // Make fields optional for update

    const branch = await this.branchService.updateBranch(
      Number(id),
      branchData
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Branch updated successfully",
      branch,
    });
  });

  public deleteBranch = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Branch id does not exist");

    await this.branchService.deleteBranch(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Branch deleted successfully",
    });
  });
}

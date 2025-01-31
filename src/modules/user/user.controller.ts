import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { UserService } from "./user.service";
import { newUserSchema } from "../../common/validators/user.validator";
import { HTTPSTATUS } from "../../config/http.config";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";

export class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  public createUserWithTempPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const inputParams = JSON.parse(req.body.inputParams);
      const { email, firstName, lastName, roleId } =
        newUserSchema.parse(inputParams);
      const image = req.file?.path;

      const user = await this.userService.createUserWithTempPassword({
        email,
        firstName,
        lastName,
        roleId,
        image,
      });

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully",
        user,
      });
    }
  );

  public getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const userId = req.user?.id;
    assertDefined(userId, "User id is not defined");
    const users = await this.userService.getAllUsers(query, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "All users are listed successfully",
      users,
      ...getPaginationInfo(req, users.count),
    });
  });

  public getUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "User id is not defined");

    const user = await this.userService.getUser(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "User retrieved successfully",
      user,
    });
  });

  public updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "User id is not defined");
    const inputParams = JSON.parse(req.body.inputParams);
    const { email, firstName, lastName, roleId } =
      newUserSchema.parse(inputParams);
    const image = inputParams.image ? inputParams.image : req.file?.path;

    const user = await this.userService.updateUser(id, {
      email,
      firstName,
      lastName,
      roleId,
      image,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "User updated successfully",
      user,
    });
  });

  public deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "User id does not exist");

    await this.userService.deleteUser(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "User deleted successfully",
    });
  });

  public addUserToGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const userId = req.user?.id;
    assertDefined(groupId, "Group id is not defined");
    assertDefined(userId, "User id is not defined");

    const user = await this.userService.addUserToGroup(+groupId, +userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User added to group successfully",
      user,
    });
  });

  public removeUserFromGroup = asyncHandler(
    async (req: Request, res: Response) => {
      const { groupId } = req.params;
      const userId = req.user?.id;
      assertDefined(groupId, "Group id is not defined");
      assertDefined(userId, "User id is not defined");

      const user = await this.userService.removeUserFromGroup(
        +groupId,
        +userId
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "User removed from group successfully",
        user,
      });
    }
  );
}

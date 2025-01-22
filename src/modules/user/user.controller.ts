import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { UserService } from "./user.service";
import { newUserSchema } from "../../common/validators/user.validator";
import { HTTPSTATUS } from "../../config/http.config";

export class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  public createUserWithTempPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const inputParams = JSON.parse(req.body.inputParams);
      const { email, firstName, lastName, roleId } = newUserSchema.parse(
        inputParams
      );
      const image = req.file?.path

      const user = await this.userService.createUserWithTempPassword({
        email,
        firstName,
        lastName,
        roleId,
        image
      });

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully",
        user
      });
    }
  );
}

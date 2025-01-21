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
      const { email, firstName, lastName, roleId } = newUserSchema.parse(
        req.body
      );

      const user = await this.userService.createUserWithTempPassword({
        email,
        firstName,
        lastName,
        roleId,
      });

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully",
        user
      });
    }
  );
}

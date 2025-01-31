import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { GroupService } from "./group.service";
import { HTTPSTATUS } from "../../config/http.config";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";
import { groupSchema } from "../../common/validators/group.validator";
import { any, unknown } from "zod";
import { RoleAttributes } from "../../database/models/role.model";
import { UserAttributes } from "../../database/models/user.model";

export class GroupController {
  private groupService: GroupService;
  constructor(groupService: GroupService) {
    this.groupService = groupService;
  }

  public createGroup = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, roles, users } = groupSchema.parse(req.body);

    const group = await this.groupService.createGroup({
      name,
      description,
      roles: roles as unknown as RoleAttributes[],
      users: users as unknown as UserAttributes[],
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Group created successfully",
      group,
    });
  });

  public updateGroup = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Group id is not defined");
    const { name, description, roles, users } = groupSchema.parse(req.body);

    const group = await this.groupService.updateGroup(id, {
      name,
      description,
      roles: roles as unknown as RoleAttributes[],
      users: users as unknown as UserAttributes[],
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Group updated successfully",
      group,
    });
  });

  public getGroup = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Group id is not defined");

    const group = await this.groupService.getGroup(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Group retrieved successfully",
      group,
    });
  });

  public getAllGroups = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;

    const groups = await this.groupService.getAllGroups(query);

    return res.status(HTTPSTATUS.OK).json({
      message: "All groups are listed successfully",
      groups,
      ...getPaginationInfo(req, groups.count),
    });
  });

  public getGroupsForSelect = asyncHandler(
    async (req: Request, res: Response) => {
      const groups = await this.groupService.getGroupsForSelect();

      return res.status(HTTPSTATUS.OK).json({
        message: "All groups for select are listed successfully",
        groups,
      });
    }
  );

  public deleteGroup = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Group id does not exist");

    await this.groupService.deleteGroup(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Group deleted successfully",
    });
  });

  public addRoleToGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupId, roleId } = req.params;
    assertDefined(groupId, "Group id is not defined");
    assertDefined(roleId, "Role id is not defined");

    await this.groupService.addRoleToGroup(+groupId, +roleId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Role added to group successfully",
    });
  });

  public removeRoleFromGroup = asyncHandler(
    async (req: Request, res: Response) => {
      const { groupId, roleId } = req.params;
      assertDefined(groupId, "Group id is not defined");
      assertDefined(roleId, "Role id is not defined");

      await this.groupService.removeRoleFromGroup(+groupId, +roleId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Role removed from group successfully",
      });
    }
  );

  public addUserToGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupId, userId } = req.params;
    assertDefined(groupId, "Group id is not defined");
    assertDefined(userId, "User id is not defined");

    await this.groupService.addUserToGroup(+groupId, +userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User added to group successfully",
    });
  });

  public removeUserFromGroup = asyncHandler(
    async (req: Request, res: Response) => {
      const { groupId, userId } = req.params;
      assertDefined(groupId, "Group id is not defined");
      assertDefined(userId, "User id is not defined");

      await this.groupService.removeUserFromGroup(+groupId, +userId);

      return res.status(HTTPSTATUS.OK).json({
        message: "User removed from group successfully",
      });
    }
  );

  public getGroupRoles = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    assertDefined(groupId, "Group id is not defined");

    const roles = await this.groupService.getGroupRoles(+groupId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Group roles retrieved successfully",
      roles,
    });
  });
}

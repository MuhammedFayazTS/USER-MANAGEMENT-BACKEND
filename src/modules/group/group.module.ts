import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";

const groupService = new GroupService();
const groupController = new GroupController(groupService);

export { groupService, groupController };
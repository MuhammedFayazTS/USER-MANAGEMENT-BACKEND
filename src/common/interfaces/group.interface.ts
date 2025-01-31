import { RoleAttributes } from "../../database/models/role.model";
import { UserAttributes } from "../../database/models/user.model";

export interface NewGroup {
  name: string;
  description?: string;
  roles?: RoleAttributes[];
  users?: UserAttributes[];
}

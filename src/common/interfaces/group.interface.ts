import { RoleAttributes } from "../../database/models/role.model";

export interface NewGroup {
  name: string;
  description?: string;
  roles?: RoleAttributes[];
}

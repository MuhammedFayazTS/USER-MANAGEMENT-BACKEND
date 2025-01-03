import { PermissionAttributes } from "../../database/models/permission.model";

export interface NewRole {
  name: string;
  description?: string;
  permissions: PermissionAttributes[];
}

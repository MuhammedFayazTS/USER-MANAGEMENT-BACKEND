interface PermissionInput {
  permissions: Array<number>;
}

export interface UpdateRolePermissionInput extends PermissionInput {}

export interface UpdateModulePermissionInput extends PermissionInput {}

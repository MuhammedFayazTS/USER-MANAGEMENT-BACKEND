const enum ErrorCode {
  AUTH_EMAIL_ALREADY_EXISTS = "AUTH_EMAIL_ALREADY_EXISTS",
  AUTH_INVALID_TOKEN = "AUTH_INVALID_TOKEN",
  AUTH_USER_NOT_FOUND = "AUTH_USER_NOT_FOUND",
  AUTH_NOT_FOUND = "AUTH_NOT_FOUND",
  AUTH_TOO_MANY_ATTEMPTS = "AUTH_TOO_MANY_ATTEMPTS",
  AUTH_UNAUTHORIZED_ACCESS = "AUTH_UNAUTHORIZED_ACCESS",
  AUTH_TOKEN_NOT_FOUND = "AUTH_TOKEN_NOT_FOUND",
  AUTH_WRONG_PASSWORD = "AUTH_WRONG_PASSWORD",

  // Permission errors
  PERMISSION_NOT_FOUND = "PERMISSION_NOT_FOUND",
  PERMISSION_DELETE_NOT_ALLOWED = "PERMISSION_DELETE_NOT_ALLOWED",

  // Access Control Errors
  ACCESS_FORBIDDEN = "ACCESS_FORBIDDEN",
  ACCESS_UNAUTHORIZED = "ACCESS_UNAUTHORIZED",

  // Validation and Resource Errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",

  // user
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_DELETE_NOT_ALLOWED = "USER_DELETE_NOT_ALLOWED",

  // role
  ROLE_NOT_FOUND = "ROLE_NOT_FOUND",
  ROLE_DELETE_NOT_ALLOWED = "ROLE_DELETE_NOT_ALLOWED",

  // module
  MODULE_NOT_FOUND = "MODULE_NOT_FOUND",
  MODULE_DELETE_NOT_ALLOWED = "MODULE_DELETE_NOT_ALLOWED",

  // group
  GROUP_NOT_FOUND = "GROUP_NOT_FOUND",
  GROUP_DELETE_NOT_ALLOWED = "GROUP_DELETE_NOT_ALLOWED",

  // db validation
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",

  // System Errors
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  VERIFICATION_ERROR = "VERIFICATION_ERROR",
  UNSUPPORTED_FILE_TYPE = "UNSUPPORTED_FILE_TYPE",
}

export { ErrorCode };

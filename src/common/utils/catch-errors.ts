import { UniqueConstraintError } from "sequelize";
import { HTTPSTATUS, HttpStatusCode } from "../../config/http.config";
import { ErrorCode } from "../enums/error-code.enum";
import { AppError } from "./AppError";

export class NotFoundException extends AppError {
  constructor(message = "Resource not found", errorCode?: ErrorCode) {
    super(message);
    HTTPSTATUS.NOT_FOUND, errorCode || ErrorCode.RESOURCE_NOT_FOUND;
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCode.ACCESS_UNAUTHORIZED
    );
  }
}

export class InternalServerException extends AppError {
  constructor(message = "Internal Server Error", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}

export class HttpException extends AppError {
  constructor(
    message = "Http ExceptionError",
    statusCode: HttpStatusCode,
    errorCode?: ErrorCode
  ) {
    super(message, statusCode, errorCode);
  }
}

export class PermissionNotFoundException extends AppError {
  constructor(message = "Permission Not Found", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCode.PERMISSION_NOT_FOUND
    );
  }
}

export class PermissionDeleteNotAllowedException extends AppError {
  constructor(errorCode?: ErrorCode) {
    super(
      "Permission cannot be deleted because it is currently in use.",
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCode.PERMISSION_DELETE_NOT_ALLOWED
    );
  }
}

export class RoleDeleteNotAllowedException extends AppError {
  constructor(errorCode?: ErrorCode) {
    super(
      "Role cannot be deleted because it is currently in use.",
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCode.ROLE_DELETE_NOT_ALLOWED
    );
  }
}

export class ModuleDeleteNotAllowedException extends AppError {
  constructor(errorCode?: ErrorCode) {
    super(
      "Module cannot be deleted because it is currently in use.",
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCode.MODULE_DELETE_NOT_ALLOWED
    );
  }
}

export class BranchDeleteNotAllowedException extends AppError {
  constructor(errorCode?: ErrorCode) {
    super(
      "Branch cannot be deleted because it is currently in use.",
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCode.BRANCH_DELETE_NOT_ALLOWED
    );
  }
}

export class SequelizeUniqueConstraintException extends AppError {
  constructor(error: UniqueConstraintError, errorCode?: ErrorCode) {
    const field = Object.keys(error.fields)[0];
    const message = field
      ? `${field} already exists` 
      : "Duplicate value for unique constraint";
    
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCode.DUPLICATE_ENTRY
    );
  }
}
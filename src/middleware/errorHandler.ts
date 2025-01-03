import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../common/utils/AppError";
import { z, ZodError } from "zod";
import {
  clearAuthenticationCookies,
  REFRESH_PATH,
} from "../common/utils/cookie";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { SequelizeUniqueConstraintException } from "../common/utils/catch-errors";

const formatZodError = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
  });
};

const formatSequelizeValidationError = (error: ValidationError) => {
  return error.errors.map((err) => ({
    field: err.path,
    message: err.message,
  }));
};

const formatSequelizeUniqueConstraintError = (error: UniqueConstraintError) => {
  if (typeof error.fields === "object" && error.fields !== null) {
    const fields = Object.keys(error.fields) as string[];

    return [
      {
        field: fields.join(", "),
        message: `${error.message}, Duplicate value for unique constraint`,
      },
    ];
  }

  return [
    {
      field: "unknown",
      message: "Duplicate value for unique constraint",
    },
  ];
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.log(`Error occured on PATH ${req.path}`, error);

  if (req.path === REFRESH_PATH) {
    clearAuthenticationCookies(res);
  }

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format, please check your request body",
    });
  }

  if (error instanceof z.ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  if (error instanceof ValidationError) {
    const validationErrors = formatSequelizeValidationError(error);
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  if (error instanceof UniqueConstraintError) {
    const uniqueConstraintException = new SequelizeUniqueConstraintException(
      error
    );
    return res.status(uniqueConstraintException.statusCode).json({
      message: uniqueConstraintException.message,
      errors: [
        {
          field: Object.keys(error.fields)[0],
          message: uniqueConstraintException.message,
        },
      ],
    });
  }


  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};

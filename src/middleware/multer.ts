import multer, { StorageEngine, FileFilterCallback, MulterError } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/utils/AppError";
import { HTTPSTATUS } from "../config/http.config";
import { ErrorCode } from "../common/enums/error-code.enum";

const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

// Storage configuration
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = "./public/uploads";
    const { uploadDirectory = "common" } = req.body;

    let uploadDir: string;

    // Determine upload sub-directory based on file mimetype
    if (file.mimetype.startsWith("image")) {
      uploadDir = path.join(baseDir, "images", uploadDirectory);
    } else if (file.mimetype === "application/pdf") {
      uploadDir = path.join(baseDir, "documents");
    } else {
      return cb(
        new AppError("Invalid file type", HTTPSTATUS.BAD_REQUEST),
        null as unknown as string
      );
    }

    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// File filter for allowed file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Only images and PDFs are allowed",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCode.UNSUPPORTED_FILE_TYPE
      )
    );
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

export const uploadSingleMiddleware =
  (fieldName: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const uploadHandler = upload.single(fieldName);
    uploadHandler(req, res, (err) => {
      if (err instanceof MulterError) {
        return next(
          new AppError(
            `Multer Error: ${err.message}`,
            HTTPSTATUS.BAD_REQUEST,
            ErrorCode.UNSUPPORTED_FILE_TYPE
          )
        );
      } else if (err instanceof AppError) {
        return next(err);
      } else if (err) {
        return next(
          new AppError(
            "File upload error",
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            err
          )
        );
      }
      next();
    });
  };

import type { NextFunction, Request, Response, Express } from "express";
import { ApiError } from "../utils/apiError";

export interface ValidateImageOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
}

export default function validatePhotoMiddleware(
  fieldName = "file",
  {
    maxSize = 5 * 1024 * 1024,
    allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  }: ValidateImageOptions = {}
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const file = req.file as Express.Multer.File;

      if (!file || !file.buffer) {
        throw ApiError.BadRequest("Image is required", {
          [fieldName]: "Image is required",
        });
      }

      if (file.size === 0) {
        throw ApiError.BadRequest("Image is empty", {
          [fieldName]: "Image is empty",
        });
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw ApiError.BadRequest("Invalid file type", {
          [fieldName]: `Only image types (${allowedMimeTypes.join(
            ", "
          )}) are allowed`,
        });
      }

      if (file.size > maxSize) {
        throw ApiError.BadRequest("Image too large", {
          [fieldName]: `Max image size is ${(maxSize / 1024 / 1024).toFixed(
            2
          )} MB`,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

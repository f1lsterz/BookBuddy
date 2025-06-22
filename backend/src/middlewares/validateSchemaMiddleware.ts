import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema, ValidationError } from "joi";
import { ApiError } from "../utils/apiError";

interface ValidationSchemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

export default function validateSchema(schemas: ValidationSchemas = {}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { body, params, query } = schemas;

    try {
      if (body) {
        const { error } = body.validate(req.body, { abortEarly: false });
        if (error)
          throw ApiError.BadRequest("Validation error", extractErrors(error));
      }

      if (params) {
        const { error } = params.validate(req.params, { abortEarly: false });
        if (error)
          throw ApiError.BadRequest("Validation error", extractErrors(error));
      }

      if (query) {
        const { error } = query.validate(req.body, { abortEarly: false });
        if (error)
          throw ApiError.BadRequest("Validation error", extractErrors(error));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

function extractErrors(error: ValidationError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const detail of error.details) {
    const key = detail.path.join(".");
    const cleanMessage = detail.message.replace(/^"(.+)"\s+/, "").trim();
    result[key] = cleanMessage;
  }
  return result;
}

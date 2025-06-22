import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export default function errorMiddleware(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    message: "Unpredictable error",
  });
}

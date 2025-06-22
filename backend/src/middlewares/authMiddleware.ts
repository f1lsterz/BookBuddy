import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, DecodedToken } from "../utils/types/types";
import { ApiError } from "../utils/apiError";

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw ApiError.Unauthorized("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw ApiError.Unauthorized(
        "Token is missing from the authorization header"
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw ApiError.InternalServerError(
        "JWT_SECRET is not defined in environment variables"
      );
    }

    let decodedData;
    try {
      decodedData = jwt.verify(token, secret) as DecodedToken;
    } catch (error) {
      throw ApiError.Unauthorized("Invalid or expired token");
    }

    req.user = decodedData;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;

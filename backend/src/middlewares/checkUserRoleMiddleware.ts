import type { NextFunction, Response } from "express";
import { ROLES } from "../utils/enums/roles";
import { AuthenticatedRequest } from "../utils/types/types";
import { ApiError } from "../utils/apiError";

const checkRole = (allowedRoles: ROLES[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      if (!req.user) {
        throw ApiError.Unauthorized("User is not authenticated");
      }

      const { role } = req.user;

      if (!allowedRoles.includes(role)) {
        throw ApiError.Forbidden(
          `Access denied. Required roles: ${allowedRoles.join(", ")}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkRole;

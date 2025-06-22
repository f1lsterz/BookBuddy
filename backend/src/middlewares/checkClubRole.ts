import ClubMembers from "../models/clubMembers.js";
import type { NextFunction, Response, Request } from "express";
import { CLUB_MEMBER_ROLE } from "../utils/enums/clubMember.js";
import { ApiError } from "../utils/apiError";

const checkClubRole = (allowedRoles: CLUB_MEMBER_ROLE[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { clubId, userId } = req.params;

      const membership = await ClubMembers.findOne({
        where: { clubId, userId },
      });

      if (!membership) {
        throw ApiError.Forbidden("You are not a member of this club.");
      }

      if (!allowedRoles.includes(membership.role)) {
        throw ApiError.Forbidden(
          `Access denied. Required roles: ${allowedRoles.join(
            ", "
          )}. Your role: ${membership.role}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkClubRole;

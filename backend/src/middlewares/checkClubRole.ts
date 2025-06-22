import ClubMembers from "../models/clubMembers.js";
import ApiError from "../exceptions/api-error.js";

const checkClubRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const { clubId, userId } = req.params;

      const membership = await ClubMembers.findOne({
        where: { clubId, userId },
      });

      if (!membership) {
        throw ApiError.Forbidden("You are not member of this club.");
      }

      if (!requiredRoles.includes(membership.role)) {
        throw ApiError.Forbidden(
          `Required roles: "${requiredRoles.join(
            ", "
          )}" for accessing this operation.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkClubRole;

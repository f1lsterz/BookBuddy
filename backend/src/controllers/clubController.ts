import type { Request, Response, NextFunction } from "express";
import ClubService from "../service/clubService.js";
import { ApiError } from "../utils/apiError.js";

class ClubController {
  async createBookClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, adminId } = req.body;
      const imageFile = req.file;

      const bookClub = await ClubService.createBookClub(
        name,
        description,
        adminId,
        imageFile
      );

      res.status(201).json(bookClub);
    } catch (error) {
      next(error);
    }
  }

  async updateBookClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId } = req.params;
      const { name, description } = req.body;
      const image = req.file;

      const updates: Record<string, any> = {};
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (image) updates.image = image;

      if (!Object.keys(updates).length) {
        return res.status(400).json({ message: "No fields to update" });
      }

      const updatedClub = await ClubService.updateBookClub(clubId, updates);
      res.status(200).json(updatedClub);
    } catch (error) {
      next(error);
    }
  }

  async getAllClubs(req: Request, res: Response, next: NextFunction) {
    try {
      const clubs = await ClubService.getAllClubs();
      res.status(200).json(clubs);
    } catch (error) {
      next(error);
    }
  }

  async getClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId } = req.params;
      const club = await ClubService.getClub(clubId);
      res.status(200).json(club);
    } catch (error) {
      next(error);
    }
  }

  async searchClubs(req: Request, res: Response, next: NextFunction) {
    try {
      const { query = "", filterFull = false } = req.query;
      const clubs = await ClubService.searchClubs(
        query as string,
        filterFull === "true"
      );
      res.status(200).json(clubs);
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId, memberId } = req.params;
      const role = req.body.role || "member";

      await ClubService.isUserInClub(clubId, memberId);
      const member = await ClubService.addMember(clubId, memberId, role);

      res.status(200).json(member);
    } catch (error) {
      next(error);
    }
  }

  async removeMemberFromClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId, adminId, userId } = req.params;
      const { isMember, role } = await ClubService.isUserInClub(
        clubId,
        adminId
      );

      if (!isMember || role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admins can remove members" });
      }

      const result = await ClubService.removeMemberFromClub(clubId, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async leaveFromClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId, userId } = req.params;
      const { isMember, role } = await ClubService.isUserInClub(clubId, userId);

      if (!isMember) {
        return res.status(403).json({ message: "User not in this club" });
      }

      if (role === "admin") {
        await ClubService.deleteBookClub(clubId);
        return res
          .status(200)
          .json({ message: "Club deleted because admin left" });
      }

      await ClubService.leaveFromClub(clubId, userId);
      res.status(200).json({ message: "Left the club successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId } = req.params;
      const members = await ClubService.getMembers(clubId);
      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  }

  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId, userId } = req.params;
      const { text } = req.body;

      const message = await ClubService.addMessage(clubId, userId, text);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  async getChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId } = req.params;
      const { limit = "10", offset = "0" } = req.query;

      const messages = await ClubService.getChatMessages(
        clubId,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }

  async checkMembership(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId, userId } = req.params;
      const status = await ClubService.isUserInClub(clubId, userId);
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }

  async isUserInAnyClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const isInClub = await ClubService.isUserInAnyClub(userId);
      res.status(200).json({ isInClub });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClubController();

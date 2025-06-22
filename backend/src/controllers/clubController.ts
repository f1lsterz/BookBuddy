import ClubService from "../service/club_service.js";

class ClubController {
  async createBookClub(req, res, next) {
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

  async updateBookClub(req, res, next) {
    try {
      const { clubId } = req.params;
      const { name, description } = req.body;
      const image = req.file;

      const updates = {};

      if (name) {
        updates.name = name;
      }

      if (description) {
        updates.description = description;
      }

      if (image) {
        updates.image = image;
      }

      if (Object.keys(updates).length > 0) {
        const updatedClub = await ClubService.updateBookClub(clubId, updates);
        res.json(updatedClub);
      } else {
        res.status(400).json({ message: "No valid fields to update" });
      }
    } catch (error) {
      next(error);
    }
  }

  async searchClubs(req, res, next) {
    try {
      const { query, filterFull } = req.query;
      let clubs = await ClubService.searchClubs(query, filterFull);
      res.json(clubs);
    } catch (error) {
      next(error);
    }
  }

  async getAllClubs(req, res, next) {
    try {
      const clubs = await ClubService.getAllClubs();
      res.json(clubs);
    } catch (error) {
      next(error);
    }
  }

  async getClub(req, res, next) {
    try {
      const { clubId } = req.params;
      const club = await ClubService.getClub(clubId);
      res.json(club);
    } catch (error) {
      next(error);
    }
  }

  async addMember(req, res, next) {
    try {
      const { clubId, memberId } = req.params;
      const role = req.body.role || "member";

      await ClubService.isUserInClub(clubId, memberId);

      const member = await ClubService.addMember(clubId, memberId, role);
      res.json(member);
    } catch (error) {
      next(error);
    }
  }

  async removeMemberFromClub(req, res, next) {
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
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async leaveFromClub(req, res, next) {
    try {
      const { clubId, userId } = req.params;
      const { isMember, role } = await ClubService.isUserInClub(clubId, userId);
      if (!isMember) {
        return res
          .status(403)
          .json({ message: "Member not found in this club." });
      }

      if (role === "admin") {
        await ClubService.deleteBookClub(clubId);
        return res.status(200).json({
          message: "Club is deleted because admin left club.",
        });
      }

      await ClubService.leaveFromClub(clubId, userId);
      return res.status(200).json({ message: "Member has been deleted." });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req, res, next) {
    try {
      const { clubId } = req.params;
      const members = await ClubService.getMembers(clubId);
      res.json(members);
    } catch (error) {
      next(error);
    }
  }

  async addMessage(req, res, next) {
    try {
      const { clubId, userId } = req.params;
      const { text } = req.body;
      const chatMessage = await ClubService.addMessage(clubId, userId, text);
      res.status(201).json(chatMessage);
    } catch (error) {
      next(error);
    }
  }

  async getChatMessages(req, res, next) {
    try {
      const { clubId } = req.params;
      const { limit, offset } = req.query;
      const messages = await ClubService.getChatMessages(
        clubId,
        parseInt(limit, 10) || 10,
        parseInt(offset, 10) || 0
      );
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  async setClubImage(req, res) {
    const { clubId } = req.params;
    const { image } = req.body;

    try {
      const result = await ClubService.setClubImage(clubId, image);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async checkMembership(req, res, next) {
    try {
      const { clubId, userId } = req.params;

      const membershipStatus = await ClubService.isUserInClub(clubId, userId);

      res.json(membershipStatus);
    } catch (error) {
      next(error);
    }
  }

  async isUserInAnyClub(req, res, next) {
    try {
      const { userId } = req.params;

      const isUserInAnyClub = await ClubService.isUserInAnyClub(userId);

      res.json({ isInClub: isUserInAnyClub });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClubController();

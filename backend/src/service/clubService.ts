import ApiError from "../exceptions/api-error.js";
import BookClub from "../models/bookClub.js";
import User from "../models/user.js";
import ClubMembers from "../models/clubMembers.js";
import ChatMessage from "../models/chatMessage.js";
import UserProfile from "../models/userProfile.js";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

class ClubService {
  async createBookClub(name, description, adminId, imageFile) {
    const existingMember = await ClubMembers.findOne({
      where: { userId: adminId },
    });

    if (existingMember) {
      throw ApiError.BadRequest(
        "User is already a member of another club and cannot create a new club."
      );
    }

    let imageUrl = null;
    if (imageFile) {
      imageUrl = `/uploads/${imageFile.filename}`;
    }

    const bookClub = await BookClub.create({
      name,
      description,
      image: imageUrl,
      memberCount: 1,
    });

    await ClubMembers.create({
      clubId: bookClub.id,
      userId: adminId,
      role: "admin",
    });
    return bookClub;
  }

  async searchClubs(query, filterFull) {
    const conditions = {
      where: {},
    };

    if (query) {
      conditions.where.name = { [Op.like]: `%${query}%` };
    }

    if (filterFull) {
      conditions.where.memberCount = {
        [Op.lt]: process.env.MAX_MEMBER_COUNT || 50,
      };
    }

    const clubs = await BookClub.findAll(conditions);

    return clubs;
  }

  async getAllClubs() {
    return await BookClub.findAll();
  }

  async getClub(clubId) {
    const club = await BookClub.findByPk(clubId);

    if (!club) {
      throw ApiError.BadRequest("Club not found");
    }
    return club;
  }

  async updateBookClub(clubId, { name, description, image }) {
    const bookClub = await BookClub.findByPk(clubId);
    if (!bookClub) {
      throw ApiError.NotFound("Book club not found");
    }

    let imageUrl = bookClub.image;

    if (image) {
      imageUrl = `/uploads/${image.filename}`;
    }

    const updatedClub = await bookClub.update({
      name: name || bookClub.name,
      description: description || bookClub.description,
      image: imageUrl,
    });

    return updatedClub;
  }

  async deleteBookClub(clubId) {
    try {
      const bookClub = await BookClub.findByPk(clubId);
      if (!bookClub) {
        throw ApiError.NotFound("Book club not found");
      }
      await ChatMessage.destroy({ where: { clubId } });
      await ClubMembers.destroy({ where: { clubId } });
      await bookClub.destroy();

      return { message: "Club successfully deleted" };
    } catch (error) {
      console.error("Error deleting club:", error);
      throw ApiError.BadRequest("Failed to delete the club");
    }
  }

  async addMember(clubId, userId, role = "member") {
    const bookClub = await BookClub.findByPk(clubId);
    if (!bookClub) {
      throw ApiError.NotFound("Book club not found");
    }
    const member = await ClubMembers.create({ clubId, userId, role });
    await bookClub.increment("memberCount");
    return member;
  }

  async isUserInClub(clubId, userId) {
    const membership = await ClubMembers.findOne({
      where: { clubId, userId },
      attributes: ["role"],
    });

    if (membership) {
      return { isMember: true, role: membership.role };
    }

    return { isMember: false, role: null };
  }

  async isUserInAnyClub(userId) {
    return !!(await ClubMembers.findOne({ where: { userId } }));
  }

  async leaveFromClub(clubId, userId) {
    const membership = await ClubMembers.findOne({
      where: { clubId, userId },
    });
    if (!membership) {
      throw ApiError.BadRequest("Member not found in this club");
    }
    await membership.destroy();

    const bookClub = await BookClub.findByPk(clubId);
    if (bookClub) {
      bookClub.memberCount = Math.max(bookClub.memberCount - 1, 0);
      await bookClub.save();
    }

    return { message: "Member removed from the club" };
  }

  async removeMemberFromClub(clubId, userId) {
    const membership = await ClubMembers.findOne({
      where: { clubId, userId },
    });

    if (!membership) {
      throw new Error("The user is not a member of this club");
    }

    await membership.destroy();

    const bookClub = await BookClub.findByPk(clubId);
    if (bookClub) {
      bookClub.memberCount = Math.max(bookClub.memberCount - 1, 0);
      await bookClub.save();
    }

    return { message: "The member has been removed from the club" };
  }

  async getMembers(clubId) {
    const clubMembers = await ClubMembers.findAll({
      where: { clubId },
      attributes: ["id", "userId", "role"],
    });

    const membersWithProfile = await Promise.all(
      clubMembers.map(async (member) => {
        const userProfile = await UserProfile.findOne({
          where: { userId: member.userId },
          attributes: ["name", "profileImage"],
        });
        return {
          id: member.id,
          userId: member.userId,
          role: member.role,
          name: userProfile.name,
          profileImage: userProfile.profileImage,
        };
      })
    );

    return membersWithProfile;
  }

  async addMessage(clubId, userId, message) {
    const club = await BookClub.findByPk(clubId);
    if (!club) {
      throw ApiError.NotFound("Club not found");
    }
    const chatMessage = await ChatMessage.create({ clubId, userId, message });
    return chatMessage;
  }

  async getChatMessages(clubId, limit, offset) {
    const messages = await ChatMessage.findAll({
      where: { clubId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const userIds = [...new Set(messages.map((msg) => msg.userId))];

    const users = await User.findAll({
      where: { id: userIds },
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: ["name", "profileImage"],
        },
      ],
    });

    const userMap = users.reduce((map, user) => {
      map[user.id] = {
        name: user.profile?.name,
        profileImage: user.profile?.profileImage,
      };
      return map;
    }, {});

    const result = messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      createdAt: msg.createdAt,
      sender: userMap[msg.userId] || null,
    }));

    return result;
  }

  async setClubImage(clubId, image) {
    const bookClub = await BookClub.findByPk(clubId);
    if (!bookClub) {
      throw ApiError.NotFound("Club not found");
    }
    bookClub.image = image;
    await bookClub.save();
    return bookClub;
  }
}

export default new ClubService();

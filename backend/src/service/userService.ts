import User from "../models/user.js";
import UserProfile from "../models/userProfile.js";
import Library from "../models/library.js";
import BookClub from "../models/bookClub.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../exceptions/api-error.js";
import dotenv from "dotenv";
import ClubMembers from "../models/clubMembers.js";
import FriendRequest from "../models/friendRequest.js";
dotenv.config();

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
  });
};

class UserService {
  async registration(email, password, role, name) {
    if (!email || !password || !name || !role) {
      throw ApiError.BadRequest("All fields are required");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      name,
      password: hashPassword,
      role,
    });

    await UserProfile.create({
      name,
      userId: user.id,
      favoriteGenres: [],
      profileImage: null,
      bio: null,
    });

    const defaultLibraries = [
      "Favourite",
      "Reading",
      "Already read",
      "Wanna read",
      "Dropped",
    ];
    const libraries = defaultLibraries.map((status) => ({
      status,
      userId: user.id,
    }));
    await Library.bulkCreate(libraries);

    const token = generateJwt(user.id, user.email, user.role);
    return { token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw ApiError.BadRequest("Email and password are required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest("User with this email was not found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect password");
    }
    const token = generateJwt(user.id, user.email, user.role);
    return { token };
  }

  async getUserProfile(userId) {
    const userProfile = await UserProfile.findOne({
      where: { userId },
      include: { model: User, as: "user" },
    });
    if (!userProfile) {
      throw ApiError.NotFound(`User profile with id ${userId} not found`);
    }
    return userProfile;
  }

  async getUserClub(userId) {
    try {
      const clubMembership = await ClubMembers.findOne({
        where: { userId },
        include: {
          model: BookClub,
          as: "club",
        },
      });

      if (!clubMembership) {
        return null;
      }

      return {
        club: clubMembership.club,
        role: clubMembership.role,
      };
    } catch (error) {
      console.error("Error fetching user club:", error);
      throw error;
    }
  }

  async updateUserProfile(userId, name, bio, favoriteGenres, imageFile) {
    const userProfile = await UserProfile.findOne({
      where: { userId },
      include: { model: User, as: "user" },
    });
    if (!userProfile) {
      throw ApiError.NotFound(`User profile with id ${userId} not found`);
    }

    let imageUrl = null;
    if (imageFile) {
      imageUrl = `/uploads/${imageFile.filename}`;
    }

    userProfile.name = name || userProfile.name;
    userProfile.bio = bio || userProfile.bio;
    userProfile.favoriteGenres = favoriteGenres || userProfile.favoriteGenres;
    userProfile.profileImage = imageUrl || userProfile.profileImage;
    await userProfile.save();
    return userProfile;
  }

  async removeFriend(userId1, userId2) {
    const user1 = await User.findByPk(userId1);
    const user2 = await User.findByPk(userId2);

    if (!user1 || !user2) {
      throw ApiError.BadRequest("One or both users not found");
    }

    const isFriend =
      (await user1.hasFriend(user2)) && (await user2.hasFriend(user1));

    if (isFriend) {
      await user1.removeFriend(user2);
      await user2.removeFriend(user1);
      return { message: "Friendship removed" };
    } else {
      return { message: "You are not friends" };
    }
  }

  async getFriends(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: "friends",
          through: { attributes: [] },
          attributes: ["id"],
        },
      ],
    });

    if (!user) {
      throw ApiError.BadRequest("User not found");
    }

    const friendIds = user.friends.map((friend) => friend.id);

    const friendProfiles = await UserProfile.findAll({
      where: { userId: friendIds },
      attributes: ["name", "profileImage", "userId"],
    });

    return friendProfiles.map((profile) => ({
      userId: profile.userId,
      name: profile.name,
      profileImage: profile.profileImage,
    }));
  }

  async sendFriendRequest(senderId, receiverId) {
    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    if (!sender || !receiver) {
      throw ApiError.BadRequest("One or both users not found");
    }

    const areFriends = await sender.hasFriend(receiver);

    if (areFriends) {
      throw ApiError.BadRequest("You are already friends");
    }

    const existingRequest = await FriendRequest.findOne({
      where: { senderId, receiverId, status: "pending" },
    });

    if (existingRequest) {
      throw ApiError.BadRequest("Friend request already exists");
    }

    const newRequest = await FriendRequest.create({
      senderId,
      receiverId,
      status: "pending",
    });

    return newRequest;
  }

  async acceptFriendRequest(requestId) {
    const request = await FriendRequest.findByPk(requestId);

    if (!request) {
      throw ApiError.NotFound("Friend request not found");
    }

    const sender = await User.findByPk(request.senderId);
    const receiver = await User.findByPk(request.receiverId);

    if (!sender || !receiver) {
      throw ApiError.BadRequest("One or both users not found");
    }

    await sender.addFriend(receiver);
    await receiver.addFriend(sender);

    request.status = "accepted";
    await request.save();

    return { message: "Friend request accepted" };
  }

  async declineFriendRequest(requestId) {
    const request = await FriendRequest.findByPk(requestId);

    if (!request) {
      throw ApiError.NotFound("Friend request not found");
    }

    if (request.status !== "pending") {
      throw ApiError.BadRequest("Friend request is already processed");
    }

    request.status = "declined";
    await request.save();

    return { message: "Friend request declined" };
  }

  async getPendingFriendRequests(receiverId) {
    const pendingRequests = await FriendRequest.findAll({
      where: {
        receiverId,
        status: "pending",
      },
    });
    if (!pendingRequests) return [];
    const senderIds = pendingRequests.map((request) => request.senderId);

    const senders = await User.findAll({
      where: {
        id: senderIds,
      },
      attributes: ["id", "email"],
    });

    const senderProfiles = await UserProfile.findAll({
      where: {
        userId: senderIds,
      },
      attributes: ["name", "profileImage", "userId"],
    });

    const formattedRequests = pendingRequests.map((request) => {
      const sender = senders.find((sender) => sender.id === request.senderId);
      const senderProfile = senderProfiles.find(
        (profile) => profile.userId === sender.id
      );

      return {
        id: request.id,
        senderId: sender.id,
        name: senderProfile.name,
        profileImage: senderProfile.profileImage,
      };
    });

    return formattedRequests || [];
  }
}

export default new UserService();

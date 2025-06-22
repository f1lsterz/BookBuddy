import User from "../models/user.js";
import Library from "../models/library.js";
import BookClub from "../models/bookClub.js";
import dotenv from "dotenv";
import ClubMembers from "../models/clubMembers.js";
import FriendRequest from "../models/friendRequest.js";
import { ApiError } from "../utils/apiError.js";
dotenv.config();

class UserService {
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

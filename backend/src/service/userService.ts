import User from "../models/user.js";
import BookClub from "../models/bookClub.js";
import dotenv from "dotenv";
import ClubMembers from "../models/clubMembers.js";
import FriendRequest from "../models/friendRequest.js";
import { ApiError } from "../utils/apiError.js";
import { UserAttributes } from "../utils/types/types.js";
dotenv.config();

class UserService {
  async getUser(id: number): Promise<Omit<UserAttributes, "password">> {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      throw ApiError.NotFound("User not found");
    }

    return user;
  }

  async getAllUsers(): Promise<Omit<UserAttributes, "password">[]> {
    return await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
  }

  async updateUser(
    id: number,
    userData: Partial<UserAttributes>
  ): Promise<User> {
    const user = await User.findByPk(id);

    if (!user) {
      throw ApiError.NotFound("User not found");
    }

    Object.assign(user, userData);
    await user.save();
    return user;
  }

  async getUserClub(
    userId: number
  ): Promise<{ club: BookClub; role: string } | null> {
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
  }

  async removeFriend(
    userId1: number,
    userId2: number
  ): Promise<{ message: string }> {
    const [user1, user2] = await Promise.all([
      User.findByPk(userId1),
      User.findByPk(userId2),
    ]);

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

  async getFriends(userId: number): Promise<User[]> {
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

    return user.friends;
  }

  async sendFriendRequest(
    senderId: number,
    receiverId: number
  ): Promise<FriendRequest> {
    const [sender, receiver] = await Promise.all([
      User.findByPk(senderId),
      User.findByPk(receiverId),
    ]);

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

  async acceptFriendRequest(requestId: number): Promise<{ message: string }> {
    const request = await FriendRequest.findByPk(requestId);

    if (!request) {
      throw ApiError.NotFound("Friend request not found");
    }

    const [sender, receiver] = await Promise.all([
      User.findByPk(request.senderId),
      User.findByPk(request.receiverId),
    ]);

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

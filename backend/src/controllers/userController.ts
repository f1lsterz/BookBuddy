import type { Request, Response, NextFunction } from "express";
import userService from "../service/userService.js";
import { ApiError } from "../utils/apiError.js";

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUser(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedUser = await userService.updateUser(id, req.body);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async getUserClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const club = await userService.getUserClub(id);
      return res.status(200).json(club);
    } catch (error) {
      next(error);
    }
  }

  async sendFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { senderId, receiverId } = req.body;
      if (!senderId || !receiverId) {
        throw ApiError.BadRequest("Both senderId and receiverId are required");
      }
      const result = await userService.sendFriendRequest(senderId, receiverId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async acceptFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const result = await userService.acceptFriendRequest(requestId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async declineFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const result = await userService.declineFriendRequest(requestId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId1, userId2 } = req.body;
      if (!userId1 || !userId2) {
        throw ApiError.BadRequest("Both userId1 and userId2 are required");
      }
      const result = await userService.removeFriend(userId1, userId2);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const friends = await userService.getFriends(userId);
      return res.status(200).json(friends);
    } catch (error) {
      next(error);
    }
  }

  async getPendingFriendRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { receiverId } = req.params;
      const requests = await userService.getPendingFriendRequests(receiverId);
      return res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

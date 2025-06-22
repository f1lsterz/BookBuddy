import userService from "../service/user_service.js";

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role, name } = req.body;
      const result = await userService.registration(
        email,
        password,
        role,
        name
      );

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req, res, next) {
    try {
      const userId = req.params.id;
      const userProfile = await userService.getUserProfile(userId);
      return res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  }

  async getUserClub(req, res, next) {
    try {
      const userId = req.params.id;
      const userClub = await userService.getUserClub(userId);
      return res.status(200).json(userClub);
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req, res, next) {
    try {
      const { id } = req.params;
      const { name, bio, favoriteGenres } = req.body;

      let genresArray = [];
      if (favoriteGenres) {
        genresArray = JSON.parse(favoriteGenres);
      }

      const profileImage = req.file;
      const updatedUser = await userService.updateUserProfile(
        id,
        name,
        bio,
        genresArray,
        profileImage
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async sendFriendRequest(req, res, next) {
    try {
      const { senderId, receiverId } = req.body;
      const result = await userService.sendFriendRequest(senderId, receiverId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async acceptFriendRequest(req, res, next) {
    try {
      const { requestId } = req.params;
      const result = await userService.acceptFriendRequest(requestId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async declineFriendRequest(req, res, next) {
    try {
      const { requestId } = req.params;
      const result = await userService.declineFriendRequest(requestId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req, res, next) {
    try {
      const { userId1, userId2 } = req.body;
      const result = await userService.removeFriend(userId1, userId2);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFriends(req, res, next) {
    try {
      const { userId } = req.params;
      const friends = await userService.getFriends(userId);
      return res.status(200).json(friends);
    } catch (error) {
      next(error);
    }
  }

  async getPendingFriendRequests(req, res, next) {
    try {
      const { receiverId } = req.params;

      const pendingRequests = await userService.getPendingFriendRequests(
        receiverId
      );
      return res.status(200).json(pendingRequests || []);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

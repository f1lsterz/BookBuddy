import { Router } from "express";
import userController from "../controllers/userController.js";
import upload from "../config/multerConfig.js";

const router = Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/profile/:id", userController.getUserProfile);
router.get("/profile/:id/club", userController.getUserClub);
router.put(
  "/profile/:id",
  upload.single("profileImage"),
  userController.updateUserProfile
);

router.post("/friends/request", userController.sendFriendRequest);
router.put("/friends/accept/:requestId", userController.acceptFriendRequest);
router.put("/friends/decline/:requestId", userController.declineFriendRequest);
router.post("/friends/remove", userController.removeFriend);
router.get("/friends/:userId", userController.getFriends);
router.get(
  "/friends/pending-requests/:receiverId",
  userController.getPendingFriendRequests
);

export default router;

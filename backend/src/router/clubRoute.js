import { Router } from "express";
import ClubController from "../controllers/club_controller.js";
import checkClubRole from "../middlewares/checkClubRole.js";
import upload from "../config/multerConfig.js";

const router = Router();

router.post("/create", upload.single("image"), ClubController.createBookClub);
router.get("/search", ClubController.searchClubs);
router.get("/", ClubController.getAllClubs);
router.get("/:clubId", ClubController.getClub);
router.put(
  "/:clubId/edit",
  upload.single("image"),
  ClubController.updateBookClub
);
router.post("/:clubId/:memberId/members", ClubController.addMember);
router.delete(
  "/:clubId/:adminId/:userId/members",
  ClubController.removeMemberFromClub
);
router.delete(
  "/:clubId/:userId/members",
  checkClubRole(["admin", "member"]),
  ClubController.leaveFromClub
);
router.get("/:clubId/members", ClubController.getMembers);

router.post(
  "/:clubId/:userId/messages",
  checkClubRole(["admin", "member"]),
  ClubController.addMessage
);
router.get(
  `/:clubId/:userId/messages`,
  checkClubRole(["admin", "member"]),
  ClubController.getChatMessages
);
router.get("/:userId/check", ClubController.isUserInAnyClub);
router.get("/:clubId/members/:userId/check", ClubController.checkMembership);

export default router;

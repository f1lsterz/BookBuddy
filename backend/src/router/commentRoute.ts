import { Router } from "express";
import commentController from "../controllers/commentController.js";

const router = Router();

router.post("/:bookId", commentController.addCommentToBook);
router.get("/:bookId", commentController.getCommentsForBook);
router.delete("/:commentId", commentController.deleteComment);
router.post("/:commentId/reaction", commentController.toggleReaction);

export default router;

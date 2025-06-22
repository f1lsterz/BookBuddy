import { Router } from "express";
import bookController from "../controllers/bookController.js";

const router = Router();

router.post("/fetch", bookController.fetchAndStoreBooks);
router.get("/", bookController.getBooks);
router.get("/:bookId", bookController.getBookById);

router.post("/:bookId/comments", bookController.addCommentToBook);
router.get("/:bookId/comments", bookController.getCommentsForBook);
router.delete("/comments/:commentId/:userId", bookController.deleteComment);
router.post("/comments/:commentId/reaction", bookController.toggleReaction);

router.get("/:bookId/:userId/rating", bookController.getRating);
router.post("/:bookId/:userId/rating", bookController.setRating);
router.delete("/:bookId/:userId/rating", bookController.removeRating);
router.get("/:bookId/avgrating", bookController.getAverageRating);
router.get("/:userId/recommended", bookController.getRecommendedBooks);

export default router;

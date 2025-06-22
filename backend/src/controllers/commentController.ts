import type { Request, Response, NextFunction } from "express";
import commentService from "../service/commentService";
import { ApiError } from "../utils/apiError";

class CommentController {
  async addCommentToBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId } = req.params;
      const { userId, commentText } = req.body;

      const comment = await commentService.addCommentToBook(
        bookId,
        userId,
        commentText
      );
      res.status(201).json(comment);
    } catch (error) {
      next(ApiError.BadRequest("Failed to add comment"));
    }
  }

  async getCommentsForBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId } = req.params;
      const comments = await commentService.getCommentsForBook(bookId);
      res.status(200).json(comments);
    } catch (error) {
      next(ApiError.BadRequest("Failed to retrieve comments"));
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId, userId } = req.params;
      const result = await commentService.deleteComment(commentId, userId);
      res.status(200).json(result);
    } catch (error) {
      next(ApiError.BadRequest("Failed to delete comment"));
    }
  }

  async toggleReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const { userId, reactionType } = req.body;

      const updated = await commentService.toggleReaction(
        commentId,
        userId,
        reactionType
      );
      res.status(200).json(updated);
    } catch (error) {
      next(ApiError.BadRequest("Failed to toggle reaction"));
    }
  }
}

export default new CommentController();

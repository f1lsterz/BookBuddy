import Book from "../models/book";
import CommentReaction from "../models/commentReaction";
import Comment from "../models/comment";
import { ApiError } from "../utils/apiError";

class CommentService {
  async addCommentToBook(bookId, userId, commentText) {
    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw ApiError.BadRequest("Book not found");
      }

      const comment = await Comment.create({
        userId,
        bookId,
        comment: commentText,
      });

      book.commentCount = book.commentCount + 1;
      await book.save();

      return comment;
    } catch (error) {
      throw ApiError.BadRequest("Error adding comment");
    }
  }

  async getCommentsForBook(bookId) {
    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw ApiError.BadRequest("Book not found");
      }

      const comments = await Comment.findAll({
        where: { bookId },
        attributes: [
          "id",
          "comment",
          "likes",
          "dislikes",
          "userId",
          "createdAt",
        ],
      });

      const userIds = comments.map((c) => c.userId);
      const users = await User.findAll({
        where: { id: userIds },
        attributes: ["id"],
        include: [
          {
            model: UserProfile,
            as: "profile",
            attributes: ["name", "profileImage"],
          },
        ],
      });

      const response = comments.map((comment) => {
        const user = users.find((u) => u.id === comment.userId);
        return {
          commentId: comment.id,
          comment: comment.comment,
          likes: comment.likes,
          dislikes: comment.dislikes,
          createdAt: comment.createdAt,
          user: user
            ? {
                userId: user.id,
                name: user.profile?.name || "Unknown",
                profileImage: user.profile?.profileImage || null,
              }
            : null,
        };
      });

      return response;
    } catch (error) {
      throw ApiError.BadRequest(error.message || "Error fetching comments");
    }
  }

  async deleteComment(commentId, userId) {
    try {
      const comment = await Comment.findByPk(commentId, {
        include: [{ model: Book, as: "book" }],
      });

      if (!comment) {
        throw ApiError.BadRequest("Comment not found");
      }

      if (comment.userId != userId) {
        throw ApiError.BadRequest(
          "You are not authorized to delete this comment"
        );
      }

      const book = comment.book;

      await CommentReaction.destroy({
        where: { commentId },
      });

      await comment.destroy();

      const commentCount = await Comment.count({
        where: { bookId: book.id },
      });

      await Book.update({ commentCount }, { where: { id: book.id } });

      return { message: "Comment deleted successfully" };
    } catch (error) {
      console.error(error);
      throw ApiError.BadRequest("Error deleting comment");
    }
  }

  async toggleReaction(commentId, userId, reactionType) {
    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        throw ApiError.BadRequest("Comment not found");
      }

      if (!["like", "dislike"].includes(reactionType)) {
        throw ApiError.BadRequest("Invalid reaction type");
      }

      const existingReaction = await CommentReaction.findOne({
        where: { commentId, userId },
      });

      if (existingReaction) {
        if (existingReaction.reaction === reactionType) {
          await existingReaction.destroy();
          if (reactionType === "like") {
            comment.likes = Math.max(0, comment.likes - 1);
          } else {
            comment.dislikes = Math.max(0, comment.dislikes - 1);
          }
          await comment.save();
        } else {
          if (reactionType === "like") {
            comment.likes += 1;
            comment.dislikes = Math.max(0, comment.dislikes - 1);
          } else {
            comment.dislikes += 1;
            comment.likes = Math.max(0, comment.likes - 1);
          }

          existingReaction.reaction = reactionType;
          await existingReaction.save();
          await comment.save();
        }
      } else {
        await CommentReaction.create({
          commentId,
          userId,
          reaction: reactionType,
        });

        if (reactionType === "like") {
          comment.likes += 1;
        } else {
          comment.dislikes += 1;
        }

        await comment.save();
      }

      const response = {
        commentId: comment.id,
        comment: comment.comment,
        likes: comment.likes,
        dislikes: comment.dislikes,
      };
      return response;
    } catch (error) {
      throw ApiError.BadRequest("Error toggling reaction on comment");
    }
  }
}

export default new CommentService();

import bookService from "../service/book_service.js";
import ApiError from "../exceptions/api-error.js";

class BookController {
  async fetchAndStoreBooks(req, res) {
    try {
      const { searchQuery } = req.body;
      await bookService.fetchAndStoreBooks(searchQuery);
      res
        .status(200)
        .json({ message: "Books fetched and stored successfully." });
    } catch (error) {
      next(ApiError.InternalServerError(error.message));
    }
  }

  async getBooks(req, res, next) {
    try {
      const { page, limit, sortBy, order, query } = req.query;
      const books = await bookService.getBooks({
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sortBy: sortBy || "title",
        order: order || "ASC",
        query: query || "",
      });
      res.status(200).json(books);
    } catch (error) {
      next(ApiError.BadRequest("Error fetching books"));
    }
  }

  async getBookById(req, res, next) {
    try {
      const { bookId } = req.params;
      const book = await bookService.getBookById(bookId);
      res.status(200).json(book);
    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  }

  async addCommentToBook(req, res, next) {
    try {
      const { bookId } = req.params;
      const { userId, commentText } = req.body;
      console.log("Received data:", { userId, commentText });
      const comment = await bookService.addCommentToBook(
        bookId,
        userId,
        commentText
      );
      res.status(201).json(comment);
    } catch (error) {
      next(ApiError.BadRequest("Error adding comment"));
    }
  }

  async getCommentsForBook(req, res, next) {
    try {
      const { bookId } = req.params;
      const comments = await bookService.getCommentsForBook(bookId);
      res.status(200).json(comments);
    } catch (error) {
      next(ApiError.BadRequest("Error fetching comments"));
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentId, userId } = req.params;
      console.log(userId);
      const result = await bookService.deleteComment(commentId, userId);
      res.status(200).json(result);
    } catch (error) {
      next(ApiError.BadRequest("Error deleting comment"));
    }
  }

  async toggleReaction(req, res, next) {
    try {
      const { commentId } = req.params;
      const { userId, reactionType } = req.body;

      const comment = await bookService.toggleReaction(
        commentId,
        userId,
        reactionType
      );
      console.log(comment);
      res.status(200).json(comment);
    } catch (error) {
      next(ApiError.BadRequest(error.message || "Error toggling reaction"));
    }
  }

  async getRating(req, res, next) {
    try {
      const { bookId, userId } = req.params;
      const rating = await bookService.getUserBookRating(bookId, userId);
      res.json(rating);
    } catch (error) {
      next(error);
    }
  }

  async setRating(req, res, next) {
    try {
      const { bookId, userId } = req.params;
      const { rating } = req.body;
      const updatedRating = await bookService.upsertUserBookRating(
        bookId,
        userId,
        rating
      );
      await bookService.calculateAverageRating(bookId);
      res.json(updatedRating);
    } catch (error) {
      next(error);
    }
  }

  async removeRating(req, res, next) {
    try {
      const { bookId, userId } = req.params;
      const result = await bookService.deleteUserBookRating(bookId, userId);
      await bookService.calculateAverageRating(bookId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAverageRating(req, res, next) {
    try {
      const { bookId } = req.params;

      const averageRating = await bookService.getAverageRating(bookId);

      res.status(200).json({ averageRating });
    } catch (error) {
      next(
        ApiError.BadRequest(error.message || "Error fetching average rating")
      );
    }
  }

  async getRecommendedBooks(req, res, next) {
    try {
      const { userId } = req.params;
      const books = await bookService.getRecommendedBooks(userId);
      return res.json(books || []);
    } catch (error) {
      next(error);
    }
  }
}

export default new BookController();

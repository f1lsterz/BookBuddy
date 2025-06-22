import type { Request, Response, NextFunction } from "express";
import bookService from "../service/bookService.js";
import { ApiError } from "../utils/apiError.js";

class BookController {
  async fetchAndStoreBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const { searchQuery } = req.body;
      await bookService.fetchAndStoreBooks(searchQuery);
      res
        .status(200)
        .json({ message: "Books fetched and stored successfully." });
    } catch (error) {
      next(ApiError.BadRequest("Failed to fetch and store books"));
    }
  }

  async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        sortBy = "title",
        order = "ASC",
        query = "",
      } = req.query;

      const books = await bookService.getBooks({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sortBy: sortBy as string,
        order: order as string,
        query: query as string,
      });

      res.status(200).json(books);
    } catch (error) {
      next(ApiError.BadRequest("Failed to retrieve books"));
    }
  }

  async getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId } = req.params;
      const book = await bookService.getBookById(bookId);
      res.status(200).json(book);
    } catch (error) {
      next(ApiError.NotFound("Book not found"));
    }
  }

  async getRecommendedBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const books = await bookService.getRecommendedBooks(userId);
      res.status(200).json(books || []);
    } catch (error) {
      next(ApiError.BadRequest("Failed to fetch recommended books"));
    }
  }

  async getRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, userId } = req.params;
      const rating = await bookService.getUserBookRating(bookId, userId);
      res.status(200).json(rating);
    } catch (error) {
      next(ApiError.BadRequest("Failed to retrieve rating"));
    }
  }

  async setRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, userId } = req.params;
      const { rating } = req.body;

      const updatedRating = await bookService.upsertUserBookRating(
        bookId,
        userId,
        rating
      );
      await bookService.calculateAverageRating(bookId);
      res.status(200).json(updatedRating);
    } catch (error) {
      next(ApiError.BadRequest("Failed to set rating"));
    }
  }

  async removeRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, userId } = req.params;

      const result = await bookService.deleteUserBookRating(bookId, userId);
      await bookService.calculateAverageRating(bookId);
      res.status(200).json(result);
    } catch (error) {
      next(ApiError.BadRequest("Failed to remove rating"));
    }
  }

  async getAverageRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId } = req.params;
      const averageRating = await bookService.getAverageRating(bookId);
      res.status(200).json({ averageRating });
    } catch (error) {
      next(ApiError.BadRequest("Failed to fetch average rating"));
    }
  }
}

export default new BookController();

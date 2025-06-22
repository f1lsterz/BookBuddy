import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../utils/types/types.js";
import libraryService from "../service/libraryService.js";
import { ApiError } from "../utils/apiError.js";

class LibraryController {
  async getLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const library = await libraryService.getLibrary(userId);
      return res.json(library);
    } catch (error) {
      next(error);
    }
  }

  async createCustomLibrary(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { customLibraryName, visibility } = req.body;

      const userId = req.user?.id;

      if (!userId) {
        throw ApiError.Unauthorized("User ID is missing in token");
      }

      const newList = await libraryService.createCustomLibrary(
        userId,
        customLibraryName,
        visibility
      );
      return res.json(newList);
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomLibrary(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { libraryId } = req.params;

      const userId = req.user?.id;

      if (!userId) {
        throw ApiError.Unauthorized("User ID is missing in token");
      }

      const response = await libraryService.deleteCustomLibrary(
        userId,
        libraryId
      );
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBooksInLibrary(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { libraryId } = req.params;

      const userId = req.user?.id;

      if (!userId) {
        throw ApiError.Unauthorized("User ID is missing in token");
      }

      const books = await libraryService.getBooksInLibrary(userId, libraryId);
      return res.json(books || []);
    } catch (error) {
      next(error);
    }
  }

  async addBookToLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, libraryId } = req.params;

      const response = await libraryService.addBookToLibrary(bookId, libraryId);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeBookFromLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, libraryId } = req.params;
      const response = await libraryService.removeBookFromLibrary(
        bookId,
        libraryId
      );
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async checkBookInLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, libraryId } = req.params;
      const isBookInLibrary = await libraryService.checkBookInLibrary(
        bookId,
        libraryId
      );

      return res.json(isBookInLibrary);
    } catch (error) {
      next(error);
    }
  }

  async updateListVisibility(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { libraryId } = req.params;
      const { visibility } = req.body;

      const userId = req.user?.id;

      if (!userId) {
        throw ApiError.Unauthorized("User ID is missing in token");
      }

      const updatedList = await libraryService.updateListVisibility(
        userId,
        libraryId,
        visibility
      );
      return res.json(updatedList);
    } catch (error) {
      next(error);
    }
  }
}

export default new LibraryController();

import libraryService from "../service/library_service.js";

class LibraryController {
  async getLibrary(req, res, next) {
    try {
      const { userId } = req.params;
      const library = await libraryService.getLibrary(userId);
      return res.json(library);
    } catch (error) {
      next(error);
    }
  }

  async createCustomList(req, res, next) {
    try {
      const { userId, customListName, visibility } = req.body;
      const newList = await libraryService.createCustomList(
        userId,
        customListName,
        visibility
      );
      return res.json(newList);
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomList(req, res, next) {
    try {
      const { userId, libraryId } = req.params;
      const response = await libraryService.deleteCustomList(userId, libraryId);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBooksInList(req, res, next) {
    try {
      const { userId, libraryId } = req.params;

      const books = await libraryService.getBooksInList(userId, libraryId);
      return res.json(books || []);
    } catch (error) {
      next(error);
    }
  }

  async addBookToLibrary(req, res, next) {
    try {
      const { bookId, libraryId } = req.params;

      const response = await libraryService.addBookToLibrary(bookId, libraryId);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeBookFromLibrary(req, res, next) {
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

  async checkBookInLibrary(req, res, next) {
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

  async updateListVisibility(req, res, next) {
    try {
      const { userId, libraryId } = req.params;
      const { visibility } = req.body;

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

import Library from "../models/library.js";
import Book from "../models/book.js";
import { ApiError } from "../utils/apiError.js";

class LibraryService {
  async getLibrary(userId) {
    const library = await Library.findAll({ where: { userId } });
    if (!library) {
      throw ApiError.NotFound("Library not found for the user");
    }
    return { lists: library };
  }

  async createCustomList(userId, customListName, visibility) {
    const newList = await Library.create({
      userId,
      customListName,
      visibility,
      status: "Custom",
    });
    return newList;
  }

  async deleteCustomList(userId, libraryId) {
    const customList = await Library.findOne({
      where: { id: libraryId, userId, status: "Custom" },
    });

    if (!customList) {
      throw ApiError.BadRequest(
        "Custom list not found or does not belong to this user"
      );
    }
    await customList.destroy();

    return { message: "Custom list successfully deleted" };
  }

  async getBooksInList(userId, listId) {
    const library = await Library.findOne({
      where: { id: listId, userId },
      include: [
        {
          model: Book,
          as: "books",
          attributes: ["id", "title", "author", "coverImage", "genres"],
          through: { attributes: [] },
        },
      ],
    });
    if (!library) {
      throw ApiError.NotFound(
        "The list does not belong to the user or does not exist"
      );
    }

    return library.books || [];
  }

  async addBookToLibrary(bookId, libraryId) {
    const library = await Library.findByPk(libraryId);

    if (!library) {
      throw ApiError.NotFound("Library not found");
    }

    const book = await Book.findByPk(bookId);

    if (!book) {
      throw ApiError.NotFound("Book not found");
    }

    await library.addBook(book);

    return { message: "Book successfully added to the library" };
  }

  async removeBookFromLibrary(bookId, libraryId) {
    const library = await Library.findByPk(libraryId);

    if (!library) {
      throw ApiError.NotFound("Library not found");
    }

    const book = await Book.findByPk(bookId);

    if (!book) {
      throw ApiError.NotFound("Book not found");
    }

    await library.removeBook(book);

    return { message: "Book successfully removed from the library" };
  }

  async checkBookInLibrary(bookId, libraryId) {
    const library = await Library.findByPk(libraryId);

    if (!library) {
      throw ApiError.NotFound("Library not found");
    }

    const book = await Book.findByPk(bookId);

    if (!book) {
      throw ApiError.NotFound("Book not found");
    }

    const existingLibraryBook = await library.getBooks({
      where: { id: bookId },
    });

    return existingLibraryBook.length > 0;
  }

  async updateListVisibility(userId, libraryId, visibility) {
    const library = await Library.findOne({
      where: { id: libraryId, userId },
    });

    if (!library) {
      throw ApiError.NotFound(
        "Library not found or does not belong to the user"
      );
    }

    if (!["Private", "Friends", "Public"].includes(visibility)) {
      throw ApiError.BadRequest("Incorrect visibility");
    }

    library.visibility = visibility;
    await library.save();

    return library;
  }
}

export default new LibraryService();

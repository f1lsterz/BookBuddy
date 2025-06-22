import { ApiError } from "../utils/apiError.js";
import Book from "../models/book.js";
import dotenv from "dotenv";
dotenv.config();
import { Op } from "sequelize";
import BookRating from "../models/bookRating.js";
import Library from "../models/library.js";

class BookService {
  async fetchAndStoreBooks(searchQuery = null) {
    const apiKey = process.env.BOOK_API_KEY;
    const maxResults = 40;
    let startIndex = 0;
    const totalBooksToFetch = 300;
    const allBooks = [];

    try {
      while (startIndex < totalBooksToFetch) {
        const url = `https://www.googleapis.com/books/v1/volumes?key=${apiKey}&maxResults=${maxResults}&startIndex=${startIndex}&q=${searchQuery}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Books API");
        }

        const data = await response.json();
        const books = data.items.map((item) => ({
          title: item.volumeInfo.title || "Unknown",
          author: item.volumeInfo.authors?.join(", ") || "Unknown",
          genres: item.volumeInfo.categories || ["Unknown"],
          description: item.volumeInfo.description || "No description",
          coverImage: item.volumeInfo.imageLinks?.smallThumbnail || "",
          publicationDate: item.volumeInfo.publishedDate || null,
          pages: item.volumeInfo.pageCount || 0,
          averageRating: 0,
          commentCount: 0,
        }));

        allBooks.push(...books);
        startIndex += maxResults;
      }

      for (const book of allBooks) {
        const [createdBook, created] = await Book.findOrCreate({
          where: {
            [Op.and]: [{ title: book.title }, { author: book.author }],
          },
          defaults: book,
        });
        if (!created) {
          console.log(`Книга "${createdBook.title}" вже існує.`);
        }
      }

      console.log("Books fetched and stored successfully.");
    } catch (error) {
      console.error("Error while fetching and storing books:", error);
    }
  }

  async countBooks() {
    try {
      const count = await Book.count();
      return count;
    } catch (error) {
      console.error("Error counting books:", error);
      return 0;
    }
  }

  async getBooks({
    page = 1,
    limit = 10,
    sortBy = "title",
    order = "ASC",
    query = "",
  }) {
    try {
      const offset = (page - 1) * limit;

      const validSortFields = [
        "title",
        "author",
        "pages",
        "publicationDate",
        "averageRating",
        "commentCount",
      ];
      if (!validSortFields.includes(sortBy)) {
        throw ApiError.BadRequest("Invalid sort field");
      }

      const where = query ? { title: { [Op.like]: `%${query}%` } } : {};

      const books = await Book.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, order]],
        where,
      });

      return {
        total: books.count,
        totalPages: Math.ceil(books.count / limit),
        currentPage: page,
        books: books.rows,
      };
    } catch (error) {
      throw ApiError.BadRequest("Error fetching books");
    }
  }

  async getBookById(bookId) {
    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw ApiError.BadRequest("Book not found");
      }
      return book;
    } catch (error) {
      throw ApiError.BadRequest("Error fetching book");
    }
  }

  async calculateAverageRating(bookId) {
    try {
      const ratings = await BookRating.findAll({
        where: { bookId },
        attributes: ["rating"],
      });

      if (!ratings.length) return 0;

      const totalRating = ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      const averageRating = totalRating / ratings.length;

      const roundedAverageRating = Math.round(averageRating * 2) / 2;

      const book = await Book.findByPk(bookId);
      if (book) {
        book.averageRating = roundedAverageRating;
        await book.save();
      }

      return roundedAverageRating;
    } catch (error) {
      throw ApiError.BadRequest("Error calculating average rating");
    }
  }

  async getAverageRating(bookId) {
    try {
      const book = await Book.findByPk(bookId, {
        attributes: ["averageRating"],
      });

      if (!book) {
        throw ApiError.BadRequest("Book not found");
      }

      return book.averageRating;
    } catch (error) {
      throw ApiError.BadRequest("Error fetching average rating");
    }
  }

  async getUserBookRating(bookId, userId) {
    try {
      const rating = await BookRating.findOne({
        where: { bookId, userId },
      });
      return rating || null;
    } catch (error) {
      throw ApiError.BadRequest("Error fetching rating");
    }
  }

  async upsertUserBookRating(bookId, userId, newRating) {
    try {
      if (newRating < 0 || newRating > 5 || newRating % 0.5 !== 0) {
        throw ApiError.BadRequest("Invalid rating value");
      }

      const existingRating = await BookRating.findOne({
        where: { bookId, userId },
      });

      if (existingRating) {
        existingRating.rating = newRating;
        await existingRating.save();
        return existingRating;
      } else {
        const newRatingEntry = await BookRating.create({
          bookId,
          userId,
          rating: newRating,
        });
        return newRatingEntry;
      }
    } catch (error) {
      throw ApiError.BadRequest("Error saving rating");
    }
  }

  async deleteUserBookRating(bookId, userId) {
    try {
      const existingRating = await BookRating.findOne({
        where: { bookId, userId },
      });

      if (existingRating) {
        await existingRating.destroy();
        return { message: "Rating removed successfully" };
      } else {
        throw ApiError.BadRequest("Rating not found");
      }
    } catch (error) {
      throw ApiError.BadRequest("Error deleting rating");
    }
  }

  async getRecommendedBooks(userId) {
    const ratedBooks = await BookRating.findAll({
      where: { userId },
      attributes: ["bookId", "rating"],
    });

    const userLibraries = await Library.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          as: "books",
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });

    const ratedBookIds = new Set(ratedBooks.map((rating) => rating.bookId));
    const booksInLibraryIds = new Set(
      userLibraries.flatMap((library) => library.books.map((book) => book.id))
    );
    const excludedBookIds = Array.from(
      new Set([...ratedBookIds, ...booksInLibraryIds])
    );

    const userAuthors = new Set();
    const totalRating = ratedBooks.reduce((sum, { rating }) => sum + rating, 0);
    const averageRating =
      ratedBooks.length > 0 ? totalRating / ratedBooks.length : 0;

    if (ratedBooks.length > 0) {
      const ratedBookDetails = await Book.findAll({
        where: {
          id: { [Op.in]: Array.from(ratedBookIds) },
        },
        attributes: ["author"],
      });

      ratedBookDetails.forEach((book) => {
        if (book.author) {
          userAuthors.add(book.author);
        }
      });
    }

    let booksNotInExcludedList = await Book.findAll({
      where: {
        id: { [Op.notIn]: excludedBookIds },
      },
      attributes: ["id"],
    });

    let booksByAuthors = await Book.findAll({
      where: {
        author: { [Op.in]: Array.from(userAuthors) },
      },
      attributes: ["id"],
    });

    let booksByRating = await Book.findAll({
      where: {
        averageRating: { [Op.gte]: averageRating },
      },
      attributes: ["id"],
    });

    let validBookIds = new Set([
      ...booksNotInExcludedList.map((book) => book.id),
      ...booksByAuthors.map((book) => book.id),
      ...booksByRating.map((book) => book.id),
    ]);

    let recommendedBooks = await Book.findAll({
      where: {
        id: { [Op.in]: Array.from(validBookIds) },
      },
      order: [["averageRating", "DESC"]],
      attributes: [
        "id",
        "title",
        "author",
        "coverImage",
        "genres",
        "publicationDate",
        "pages",
      ],
    });

    if (recommendedBooks.length === 0) {
      recommendedBooks = await Book.findAll({
        where: { id: { [Op.notIn]: excludedBookIds } },
        order: [["averageRating", "DESC"]],
        limit: 4,
        attributes: [
          "id",
          "title",
          "author",
          "coverImage",
          "genres",
          "publicationDate",
          "pages",
        ],
      });
    }

    return recommendedBooks.slice(0, 5);
  }
}

export default new BookService();

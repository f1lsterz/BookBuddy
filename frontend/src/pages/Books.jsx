import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBooks, getRecommendedBooks } from "../http/bookApi";
import styles from "../styles/Books.module.css";
import Pagination from "../components/Pagination";
import book_icon from "../assets/images/book_icon.png";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import { jwtDecode } from "jwt-decode";

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("ASC");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const loadBooks = async (page, sort, sortOrder, query = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks(page, 10, sort, sortOrder, query);
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Unable to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendedBooks(userId);
      setRecommendedBooks(data || []);
    } catch (error) {
      console.error("Error fetching recommended books:", error);
      setError("Unable to fetch recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(currentPage, sortBy, order, searchQuery);
  }, [currentPage, sortBy, order, searchQuery]);

  useEffect(() => {
    loadRecommendedBooks();
  }, [userId]);

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadBooks(1, sortBy, order, searchQuery);
  };
  const handleResetSearch = () => {
    setSearchQuery("");
    loadBooks(currentPage, sortBy, order);
  };

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Book List</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title"
          className={styles.searchInput}
        />
        {/*  <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button> */}
        <button onClick={handleResetSearch} className={styles.resetButton}>
          Reset
        </button>
      </div>

      <div className={styles.sortContainer}>
        <label htmlFor="sortBy" className={styles.sortLabel}>
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={handleSortChange}
          className={styles.sortSelect}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="pages">Pages Count</option>
          <option value="publicationDate">Publication Date</option>
          <option value="averageRating">Average Rating</option>
          <option value="commentCount">Comments Count</option>
        </select>

        <label htmlFor="order" className={styles.sortLabel}>
          Order:
        </label>
        <select
          id="order"
          value={order}
          onChange={handleOrderChange}
          className={styles.sortSelect}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.grid}>
          {books.length === 0 ? (
            <p className={styles.noBooksFound}>No books found</p>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className={styles.bookCard}
                onClick={() => handleBookClick(book.id)}
              >
                <img
                  src={book.coverImage || book_icon}
                  alt={book.title}
                  className={styles.bookImage}
                />
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
              </div>
            ))
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {recommendedBooks && recommendedBooks.length > 0 && (
        <div className={styles.recommended}>
          <h2>Recommended Books</h2>
          <div className={styles.grid}>
            {recommendedBooks.map((book) => (
              <div
                key={book.id}
                className={styles.bookCard}
                onClick={() => handleBookClick(book.id)}
              >
                <img
                  src={book.coverImage || book_icon}
                  alt={book.title}
                  className={styles.bookImage}
                />
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;

import { useState, useEffect } from "react";
import styles from "../../styles/Book.module.css";
import book_icon from "../../assets/images/book_icon.png";
import ErrorPage from "../../pages/ErrorPage";
import LoadingSpinner from "../LoadingSpinner";

const BookDetails = ({ book }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (!book) {
        throw new Error("Book data is missing.");
      }
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [book]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div className={styles.bookDetailsContainer}>
      <img
        src={book.coverImage || book_icon}
        alt={book.title}
        className={styles.bookImage}
      />
      <div className={styles.bookInfo}>
        <h1>{book.title}</h1>
        <h2>by {book.author}</h2>
        <p>
          <strong>Genres:</strong> {book.genres?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Publication Date:</strong> {book.publicationDate || "N/A"}
        </p>
        <p>
          <strong>Pages:</strong> {book.pages || "N/A"}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {book.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default BookDetails;

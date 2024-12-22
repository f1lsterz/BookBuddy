import { useState, useEffect } from "react";
import ReactStars from "react-stars";
import {
  saveBookRating,
  getBookRating,
  deleteBookRating,
  getAverageRating,
} from "../../http/bookApi";
import ErrorPage from "../../pages/ErrorPage";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/Book.module.css";

const BookRating = ({ bookId, userId }) => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingUserRating, setLoadingUserRating] = useState(false);
  const [loadingAverageRating, setLoadingAverageRating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAverageRating = async () => {
    try {
      setLoadingAverageRating(true);
      const avgRating = await getAverageRating(bookId);
      setAverageRating(Number(avgRating.averageRating) || 0);
    } catch (err) {
      setErrorMessage(
        "Failed to fetch average rating. Please try again later."
      );
      console.error("Failed to fetch average rating:", err);
    } finally {
      setLoadingAverageRating(false);
    }
  };

  useEffect(() => {
    fetchAverageRating();
  }, [bookId]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserRating = async () => {
      try {
        setLoadingUserRating(true);
        const userRatingData = await getBookRating(bookId, userId);
        setUserRating(userRatingData?.rating || 0);
      } catch (err) {
        setErrorMessage("Failed to fetch your rating. Please try again later.");
        console.error("Failed to fetch user rating:", err);
      } finally {
        setLoadingUserRating(false);
      }
    };
    fetchUserRating();
  }, [bookId, userId]);

  const handleRatingChange = async (newRating) => {
    if (!userId) return;

    try {
      const clampedRating = Math.max(0, Math.min(newRating, 5));
      setUserRating(clampedRating);

      await saveBookRating(bookId, userId, clampedRating);

      await fetchAverageRating();
    } catch (err) {
      setErrorMessage("Failed to save your rating. Please try again later.");
      console.error("Failed to save user rating:", err);
    }
  };

  const handleDeleteRating = async () => {
    if (!userId) return;

    try {
      setLoadingUserRating(true);

      await deleteBookRating(bookId, userId);

      setUserRating(0);

      await fetchAverageRating();
    } catch (err) {
      setErrorMessage("Failed to delete your rating. Please try again later.");
      console.error("Failed to delete user rating:", err);
    } finally {
      setLoadingUserRating(false);
    }
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div className={styles.ratingContainer}>
      <h3 className={styles.ratingHeader}>Book Rating</h3>

      {loadingAverageRating ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.averageRatingContainer}>
          <h4 className={styles.averageRatingHeader}>Average Rating:</h4>
          <ReactStars
            count={5}
            value={averageRating}
            size={30}
            edit={false}
            color2={"#ffd700"}
          />
          <p>{averageRating.toFixed(1)} / 5</p>
        </div>
      )}

      {userId && (
        <div className={styles.userRatingContainer}>
          <h4 className={styles.userRatingHeader}>Your Rating:</h4>
          {loadingUserRating ? (
            <LoadingSpinner />
          ) : (
            <>
              <ReactStars
                count={5}
                value={userRating}
                onChange={loadingUserRating ? null : handleRatingChange}
                size={30}
                half={true}
                color2={"#ffd700"}
              />
              <p> {userRating} / 5</p>
              {userRating > 0 && (
                <button
                  onClick={handleDeleteRating}
                  className={styles.deleteRatingBtn}
                >
                  Remove Rating
                </button>
              )}
            </>
          )}
        </div>
      )}

      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
};

export default BookRating;

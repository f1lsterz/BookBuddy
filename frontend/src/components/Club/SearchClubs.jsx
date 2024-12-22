import { useState } from "react";
import { searchClubs, getAllClubs } from "../../http/clubApi";
import ErrorPage from "../../pages/ErrorPage";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/Clubs.module.css";

const SearchClubs = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [filterFull, setFilterFull] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      let results;
      if (query.trim() && filterFull) {
        results = await searchClubs(query, filterFull);
      } else if (query.trim()) {
        results = await searchClubs(query, false);
      } else if (filterFull) {
        results = await searchClubs("", filterFull);
      } else {
        results = await getAllClubs();
      }

      onResults(results.length ? results : []);
    } catch (error) {
      console.error("Error searching clubs:", error);
      setErrorMessage("Failed to search clubs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      setQuery("");
      setFilterFull(false);
      const allClubs = await getAllClubs();
      onResults(allClubs);
    } catch (error) {
      console.error("Error resetting clubs:", error);
      setErrorMessage("Failed to reset clubs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div className={styles.searchClubsContainer}>
      {isLoading && <LoadingSpinner />}
      <input
        type="text"
        value={query}
        placeholder="Search clubs..."
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      <label className={styles.filterLabel}>
        <input
          type="checkbox"
          checked={filterFull}
          onChange={() => setFilterFull((prev) => !prev)}
          className={styles.filterCheckbox}
        />
        Show clubs that are not full
      </label>
      <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button>
      <button onClick={handleReset} className={styles.resetButton}>
        Cancel
      </button>
    </div>
  );
};

export default SearchClubs;

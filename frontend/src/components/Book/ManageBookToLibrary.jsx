import { useState, useEffect } from "react";
import {
  addBookToLibrary,
  removeBookFromLibrary,
  checkBookInLibrary,
} from "../../http/libraryApi";
import styles from "../../styles/Book.module.css";
import ErrorPage from "../../pages/ErrorPage";
import LoadingSpinner from "../LoadingSpinner";

const ManageBookToLibrary = ({ bookId, libraries }) => {
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [initialLibrariesWithBook, setInitialLibrariesWithBook] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLibrariesWithBook();
  }, [bookId, libraries]);

  const fetchLibrariesWithBook = async () => {
    setIsLoading(true);
    try {
      const librariesWithBook = [];
      for (let library of libraries) {
        const isBookInLibrary = await checkBookInLibrary(bookId, library.id);
        if (isBookInLibrary) {
          librariesWithBook.push(library.id);
        }
      }
      setInitialLibrariesWithBook(librariesWithBook);
      setSelectedLibraries(librariesWithBook);
    } catch (err) {
      setError("Failed to fetch libraries with the book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLibrarySelection = (libraryId) => {
    setSelectedLibraries((prevSelected) => {
      if (prevSelected.includes(libraryId)) {
        return prevSelected.filter((id) => id !== libraryId);
      } else {
        return [...prevSelected, libraryId];
      }
    });
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const toAdd = selectedLibraries.filter(
        (id) => !initialLibrariesWithBook.includes(id)
      );
      const toRemove = initialLibrariesWithBook.filter(
        (id) => !selectedLibraries.includes(id)
      );

      await Promise.all([
        ...toAdd.map((id) => addBookToLibrary(bookId, id)),
        ...toRemove.map((id) => removeBookFromLibrary(bookId, id)),
      ]);

      setInitialLibrariesWithBook(selectedLibraries);
      setError(null);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Manage Book in Libraries</h3>
      <div className={styles.multiSelectContainer}>
        <div className={styles.multiSelect}>
          {libraries.map((library) => (
            <label key={library.id} className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={selectedLibraries.includes(library.id)}
                onChange={() => toggleLibrarySelection(library.id)}
              />
              {library.customListName || library.status}
            </label>
          ))}
        </div>
        <button onClick={saveChanges} className={styles.saveButton}>
          Save Changes
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ManageBookToLibrary;

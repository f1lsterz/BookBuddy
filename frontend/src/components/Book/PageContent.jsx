import { useState } from "react";
import styles from "../../styles/Book.module.css";
import ErrorPage from "../../pages/ErrorPage";

const PageContent = ({ pages, currentPage }) => {
  const [errorMessage, setErrorMessage] = useState("");

  try {
    if (!pages) {
      throw new Error("Pages data is not available.");
    }
  } catch (error) {
    setErrorMessage(error.message);
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div className={styles.pageContent}>
      <div className={styles.pageText}>
        {pages && pages[currentPage - 1]
          ? pages[currentPage - 1]
          : "No content available for this page."}
      </div>
    </div>
  );
};

export default PageContent;

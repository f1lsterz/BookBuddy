import React from "react";
import styles from "../styles/Books.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPagination = () => {
    const pagination = [];
    const maxVisiblePages = 2;

    if (currentPage > 1) {
      pagination.push(
        <button
          key="prev"
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </button>
      );
    }

    if (currentPage > maxVisiblePages + 1) {
      pagination.push(
        <button
          key="first"
          className={styles.pageButton}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      pagination.push(
        <span key="dots-start" className={styles.dots}>
          ...
        </span>
      );
    }

    for (
      let page = Math.max(1, currentPage - maxVisiblePages);
      page <= Math.min(totalPages, currentPage + maxVisiblePages);
      page++
    ) {
      pagination.push(
        <button
          key={page}
          className={`${styles.pageButton} ${
            currentPage === page ? styles.active : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      );
    }

    if (currentPage < totalPages - maxVisiblePages) {
      pagination.push(
        <span key="dots-end" className={styles.dots}>
          ...
        </span>
      );
      pagination.push(
        <button
          key="last"
          className={styles.pageButton}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pagination.push(
        <button
          key="next"
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      );
    }

    return pagination;
  };

  return <div className={styles.pagination}>{renderPagination()}</div>;
};

export default Pagination;

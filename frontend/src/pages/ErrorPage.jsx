import { useNavigate } from "react-router-dom";
import styles from "../styles/ErrorPage.module.css";
import { HOME_ROUTE } from "../utils/consts";

const ErrorPage = ({ message }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(HOME_ROUTE);
  };

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Oops!</h1>
      <p className={styles.errorMessage}>
        {message || "Something went wrong."}
      </p>
      <button onClick={handleBackClick} className={styles.backButton}>
        Back
      </button>
    </div>
  );
};

export default ErrorPage;

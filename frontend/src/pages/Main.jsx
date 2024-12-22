import styles from "../styles/Main.module.css";
import bookImage1 from "../assets/images/books1.png";
import bookImage2 from "../assets/images/books2.png";
import { NavLink } from "react-router-dom";
import { BOOKS_ROUTE } from "../utils/consts";

const Main = () => {
  return (
    <div className={styles.bookContainer}>
      <div className={styles.content}>
        <h1>
          Explore and share your{" "}
          <span className={styles.highlight}>personal library</span>.
        </h1>
        <p>
          Build your personal library, track your reading progress, and connect
          with friends who share your love for books. Join book clubs and share
          your favorite reads today!
        </p>
        <div className={styles.buttons}>
          <NavLink to={BOOKS_ROUTE} className={styles.searchButton}>
            Search Books
          </NavLink>
        </div>
      </div>
      <div className={styles.images}>
        <div className={styles.decorativeShapes}></div>
        <img
          src={bookImage1}
          alt="Books Illustration 1"
          className={styles.image}
        />
        <img
          src={bookImage2}
          alt="Books Illustration 2"
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default Main;

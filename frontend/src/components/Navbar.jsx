import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  PROFILE_ROUTE,
  LIBRARY_ROUTE,
  CLUBS_ROUTE,
  HOME_ROUTE,
  BOOKS_ROUTE,
} from "../utils/consts";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import mainLogo from "../assets/images/main_logo.png";
import profileIcon from "../assets/images/profile_icon.png";
import styles from "../styles/Navbar.module.css";
import { jwtDecode } from "jwt-decode";
import ErrorPage from "../pages/ErrorPage";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      userId = jwtDecode(token).id;
    } catch (error) {
      setError("Error decoding token: " + error.message);
    }
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <NavLink className={styles.navlink} to={HOME_ROUTE}>
          <img className={styles.imgLogo} src={mainLogo} alt="Logo" />
        </NavLink>
        <div className={styles.siteName}>
          <span className={styles.navText}>Book Buddy</span>
          <span className={styles.subtitle}>Online Book Library</span>
        </div>
      </div>
      <div className={styles.navItems}>
        <button className={styles.navBtn} onClick={() => navigate(HOME_ROUTE)}>
          Home
        </button>
        <button className={styles.navBtn} onClick={() => navigate(BOOKS_ROUTE)}>
          Books
        </button>
        <button className={styles.navBtn} onClick={() => navigate(CLUBS_ROUTE)}>
          Clubs
        </button>
        <button
          className={styles.navBtn}
          onClick={() => navigate(LIBRARY_ROUTE + `/${userId}`)}
        >
          Library
        </button>
      </div>
      {user.isAuth ? (
        <div className={styles.twoBtn}>
          <div className={styles.userActions}>
            <div
              className={styles.avatarContainer}
              onClick={() => navigate(PROFILE_ROUTE + `/${userId}`)}
            >
              <img
                src={profileIcon}
                alt="Profile Avatar"
                className={styles.profileAvatar}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.authBtns}>
          <button
            className={`${styles.button} ${styles.regBtn}`}
            onClick={() => navigate(LOGIN_ROUTE)}
          >
            Login
          </button>
          <button
            className={`${styles.button} ${styles.regBtn}`}
            onClick={() => navigate(REGISTRATION_ROUTE)}
          >
            Register
          </button>
        </div>
      )}
    </header>
  );
});

export default NavBar;

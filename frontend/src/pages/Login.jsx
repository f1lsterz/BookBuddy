import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import { HOME_ROUTE, REGISTRATION_ROUTE } from "../utils/consts";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { login } from "../http/userApi";
import validator from "validator";

const Login = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");
    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setPasswordError("Password cannot be empty.");
      return;
    }

    try {
      const data = await login(email, password);
      user.setUser(user);
      user.setIsAuth(true);
      navigate(HOME_ROUTE);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.h1}>Log In to Account</h1>
        <label htmlFor="email" className={styles.label}>
          Email
          <input
            type="text"
            placeholder="Email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}
        </label>

        <label htmlFor="password" className={styles.label}>
          Password
          <input
            type="password"
            placeholder="Password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className={styles.error}>{passwordError}</p>}
        </label>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <button type="submit" className={styles.button}>
          Log In
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => navigate(HOME_ROUTE)}
        >
          Skip
        </button>

        <p className={styles.signUp}>
          Don&apos;t have an account?
          <NavLink to={REGISTRATION_ROUTE}>Sign up</NavLink>
        </p>
      </form>
    </div>
  );
});

export default Login;

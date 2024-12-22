import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HOME_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { registration } from "../http/userApi";
import styles from "../styles/Registration.module.css";
import validator from "validator";

const Registration = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length >= 0 && value.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setError("");

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setPasswordError("Password cannot be empty.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      const data = await registration(email, password, username);
      user.setUser(user);
      user.setIsAuth(true);
      navigate(HOME_ROUTE);
    } catch (error) {
      console.error("Error:", error);
      setError("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    const isFormValid =
      username.trim() !== "" &&
      validateEmail(email) &&
      password.length >= 8 &&
      password === confirmPassword;
    setIsSubmitDisabled(!isFormValid);
  }, [username, email, password, confirmPassword]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.h1}>Create Account</h1>
        <label htmlFor="username" className={styles.label}>
          Username
          <input
            type="text"
            placeholder="Enter your username"
            id="username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label htmlFor="email" className={styles.label}>
          Email Address
          <input
            type="text"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            id="password"
            className={styles.input}
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <p className={styles.error}>{passwordError}</p>}
        </label>

        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
          <input
            type="password"
            placeholder="Confirm your password"
            id="confirmPassword"
            className={styles.input}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {confirmPasswordError && (
            <p className={styles.error}>{confirmPasswordError}</p>
          )}
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitDisabled}
        >
          Create Account
        </button>

        <button
          type="button"
          className={styles.button}
          onClick={() => navigate(HOME_ROUTE)}
        >
          Skip
        </button>

        <p className={styles.signIn}>
          Already have an account?
          <NavLink to={LOGIN_ROUTE}>Sign in</NavLink>
        </p>
      </form>
    </div>
  );
});

export default Registration;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Modal.module.css";
import defaultAvatar from "../../assets/images/profile_icon.png";
import { PROFILE_ROUTE, LOGIN_ROUTE } from "../../utils/consts";
import ErrorPage from "../../pages/ErrorPage";
import { jwtDecode } from "jwt-decode";
const UPLOADS = import.meta.env.VITE_API_URL;

const ProfileModal = ({ member, isOpen, onClose, friends, onToggleFriend }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const isFriend = friends.some((friend) => friend.userId === member.userId);
  if (!isOpen) return null;

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  const isAuthenticated = !!userId;

  const handleViewProfile = async () => {
    try {
      navigate(
        PROFILE_ROUTE + `/${member.userId ? member.userId : member.senderId}`
      );
      onClose();
    } catch (error) {
      console.error("Error navigating to profile:", error);
      setErrorMessage("Failed to load profile. Please try again later.");
    }
  };

  const handleToggleFriend = async () => {
    if (!isAuthenticated) {
      navigate(LOGIN_ROUTE);
      return;
    }
    try {
      await onToggleFriend(member.userId ? member.userId : member.senderId);
      onClose();
    } catch (error) {
      console.error("Error toggling friend status:", error);
      setErrorMessage(
        "Failed to update friend status. Please try again later."
      );
    }
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.cropperContainer}>
          <img
            src={
              member.profileImage
                ? UPLOADS + member.profileImage
                : defaultAvatar
            }
            alt={`${member.name}`}
            className={styles.preview}
          />
        </div>
        <h2 className={styles.h2}>{member.name}</h2>
        <div className={styles.modalButtons}>
          <button onClick={handleViewProfile}>View Profile</button>
          <button onClick={handleToggleFriend}>
            {isFriend ? "Remove from Friends" : "Add Friend"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

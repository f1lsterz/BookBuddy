import styles from "../../styles/Profile.module.css";
import defaultAvatar from "../../assets/images/profile_icon.png";
import { NavLink } from "react-router-dom";
import book_club from "../../assets/images/book_club.jpg";
const UPLOADS = import.meta.env.VITE_API_URL;

const ProfileHeader = ({ profile, userClub }) => {
  return (
    <div className={styles.profileHeader}>
      <img
        src={
          profile.profileImage ? UPLOADS + profile.profileImage : defaultAvatar
        }
        alt="Profile"
        className={styles.profileImage}
      />

      <div className={styles.profileInfo}>
        <h2>{profile.name}</h2>
        {!userClub || !userClub.club ? (
          <p>Not in any club</p>
        ) : (
          <NavLink
            to={`/clubs/${userClub.club.id}`}
            className={styles.clubLink}
          >
            <div className={styles.clubInfo}>
              <img
                src={
                  userClub.club.image
                    ? UPLOADS + userClub.club.image
                    : book_club
                }
                alt={userClub.club.name}
                className={styles.clubLogo}
              />
              <span>{userClub.club.name}</span>
            </div>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

import styles from "../../styles/Profile.module.css";

const ProfileDetails = ({ profile }) => {
  return (
    <div className={styles.profileDetails}>
      <p>Bio: {profile.bio || "No bio available"}</p>
      <div>
        <p>Favorite Genres:</p>
        <div className={styles.favoriteGenres}>
          {Array.isArray(profile.favoriteGenres) &&
          profile.favoriteGenres.length > 0
            ? profile.favoriteGenres.map((genre, index) => (
                <span key={index} className={styles.genreTag}>
                  {genre}
                </span>
              ))
            : "Not specified"}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;

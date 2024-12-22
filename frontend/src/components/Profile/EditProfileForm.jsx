import { useState } from "react";
import styles from "../../styles/Profile.module.css";
import ErrorPage from "../../pages/ErrorPage";

const EditProfileForm = ({ profile, onSave, onCancel }) => {
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [profileImage, setProfileImage] = useState(
    profile.profileImage || null
  );
  const [error, setError] = useState(null);
  const allGenres = [
    "Fiction",
    "Non-fiction",
    "Fantasy",
    "Science Fiction",
    "Romance",
    "Mystery",
    "Horror",
    "Thriller",
  ];

  const handleChange = (e) => {
    setUpdatedProfile({
      ...updatedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setUpdatedProfile((prevProfile) => {
      const newGenres = checked
        ? [...prevProfile.favoriteGenres, value]
        : prevProfile.favoriteGenres.filter((genre) => genre !== value);

      return { ...prevProfile, favoriteGenres: newGenres };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(
        updatedProfile.name,
        updatedProfile.bio,
        updatedProfile.favoriteGenres,
        profileImage
      );
    } catch (err) {
      setError(
        "An error occurred while saving your profile. Please try again."
      );
    }
  };

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <input
        type="text"
        name="name"
        value={updatedProfile.name}
        onChange={handleChange}
        placeholder="Name"
        className={styles.inputField}
      />
      <textarea
        name="bio"
        value={updatedProfile.bio || ""}
        onChange={handleChange}
        placeholder="Bio"
        className={styles.inputField}
      />

      <input
        type="file"
        name="profileImage"
        accept="image/jpeg, image/png"
        onChange={handleImageChange}
        className={styles.inputField}
      />

      <div>
        <p>Favorite Genres:</p>
        <div className={styles.favoriteGenres}>
          {allGenres.map((genre) => (
            <label key={genre} className={styles.genreTag}>
              <input
                type="checkbox"
                value={genre}
                checked={updatedProfile.favoriteGenres.includes(genre)}
                onChange={handleGenreChange}
              />
              {genre}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className={styles.saveButton}>
        Save
      </button>
      <button type="button" onClick={onCancel} className={styles.cancelButton}>
        Cancel
      </button>
    </form>
  );
};

export default EditProfileForm;

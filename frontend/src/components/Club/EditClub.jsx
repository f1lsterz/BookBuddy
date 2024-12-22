import { useState } from "react";
import styles from "../../styles/Club.module.css";
import { updateClub } from "../../http/clubApi";
import ErrorPage from "../../pages/ErrorPage";

const EditClub = ({ club, setClub, setIsEditingMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(club.name);
  const [newDescription, setNewDescription] = useState(club.description);
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);

  const handleSaveChanges = async () => {
    const formData = new FormData();

    if (newName !== club.name) formData.append("name", newName);
    if (newDescription !== club.description)
      formData.append("description", newDescription);
    if (newImage) formData.append("image", newImage);

    if (
      formData.has("name") ||
      formData.has("description") ||
      formData.has("image")
    ) {
      try {
        const updatedClub = await updateClub(club.id, formData);
        setClub(updatedClub);
        setIsEditing(false);
        setIsEditingMode(false);
      } catch (err) {
        console.error("Error updating club:", err);
        setError(
          "An error occurred while updating the club. Please try again."
        );
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsEditingMode(true);
  };

  const handleCancel = () => {
    setNewName(club.name);
    setNewDescription(club.description);
    setNewImage(null);
    setIsEditing(false);
    setIsEditingMode(false);
  };

  const handleImageUpload = (e) => {
    setNewImage(e.target.files[0]);
  };

  return (
    <div className={styles.editClubContainer}>
      {error ? (
        <ErrorPage message={error} />
      ) : isEditing ? (
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.editInput}
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className={styles.editTextarea}
          />
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/jpeg, image/png"
            className={styles.editInput}
          />
          <button onClick={handleSaveChanges} className={styles.editButton}>
            Save Changes
          </button>
          <button onClick={handleCancel} className={styles.cancelButton}>
            Cancel
          </button>
        </>
      ) : (
        <button onClick={handleEditClick} className={styles.editButton}>
          Edit Club
        </button>
      )}
    </div>
  );
};

export default EditClub;

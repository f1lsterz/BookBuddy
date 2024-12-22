import { useState } from "react";
import styles from "../../styles/Modal.module.css";
import ErrorPage from "../../pages/ErrorPage";

const CreateClubModal = ({ isOpen, onClose, onCreateClub }) => {
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      if (clubName && description) {
        await onCreateClub({ clubName, description, image });
        setClubName("");
        setDescription("");
        setImage(null);
        onClose();
      } else {
        alert("Please fill in all fields.");
      }
    } catch (error) {
      console.error("Error creating club:", error);
      setErrorMessage("Failed to create club. Please try again later.");
    }
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create New Club</h2>
        <input
          type="text"
          className={styles.textInput}
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />
        <textarea
          className={`${styles.textInput} ${styles.textareaInput}`}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          className={styles.fileInput}
          onChange={handleImageUpload}
          accept="image/jpeg, image/png"
        />
        <div className={styles.modalButtons}>
          <button onClick={handleSubmit}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateClubModal;

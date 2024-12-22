import styles from "../../styles/Modal.module.css";

const AddListModal = ({
  isOpen,
  onClose,
  onAddList,
  customListName,
  setCustomListName,
  visibility,
  setVisibility,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.h2}>Create new library</h2>
        <input
          type="text"
          value={customListName}
          placeholder="Library`s name"
          onChange={(e) => setCustomListName(e.target.value)}
          className={styles.textInput}
        />
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className={styles.textInput}
        >
          <option value="Private">Private</option>
          <option value="Public">Public</option>
          <option value="Friends">Friends</option>
        </select>
        <div className={styles.modalButtons}>
          <button onClick={() => onAddList()}>Add library</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddListModal;

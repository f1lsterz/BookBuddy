import styles from "../../styles/Modal.module.css";

const DeleteListModal = ({ isOpen, onClose, onDelete, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{message}</h2>
        <div className={styles.modalButtons}>
          <button onClick={onDelete}>Yes, delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListModal;

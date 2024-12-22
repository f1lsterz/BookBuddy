import { useState } from "react";
import ErrorPage from "../../pages/ErrorPage";
import styles from "../../styles/Club.module.css";

const ClubChat = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSend = async () => {
    try {
      if (newMessage.trim()) {
        await onSendMessage(newMessage);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Failed to send message. Please try again later.");
    }
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div>
      <div className={styles.chatContainer}>
        {messages.map((message, index) => (
          <div key={index} className={styles.chatMessage}>
            <span className={styles.chatSender}>{message.sender.name}:</span>{" "}
            {message.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        placeholder="Write message..."
        onChange={(e) => setNewMessage(e.target.value)}
        className={styles.chatInput}
      />
      <button onClick={handleSend} className={styles.chatSendButton}>
        Send
      </button>
    </div>
  );
};

export default ClubChat;

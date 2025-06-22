import { useState, useEffect } from "react";
import ProfileModal from "../modals/ProfileModal";
import { jwtDecode } from "jwt-decode";
import { removeMemberFromClub } from "../../http/clubApi";
import defaultAvatar from "../../assets/images/profile_icon.png";
import book_club from "../../assets/images/book_club.jpg";
import {
  getFriends,
  removeFriend,
  sendFriendRequest,
} from "../../http/userApi";
import ErrorPage from "../../pages/ErrorPage";
import LoadingSpinner from "../LoadingSpinner";
const UPLOADS = import.meta.env.VITE_API_URL;
import styles from "../../styles/Club.module.css";

const ClubDetails = ({ club, members, adminId }) => {
  const [clubMembers, setClubMembers] = useState(members);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  const isAdmin = userId == adminId;
  const isClubMember = clubMembers.some((member) => member.userId === userId);

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          const friendsList = await getFriends(userId);
          setFriends(friendsList);
        }
      } catch (error) {
        setErrorMessage("Failed to load friends. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  const openModal = (member) => {
    if (member.userId === userId) return;
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
  };

  const handleRemoveMember = async (userId) => {
    setIsLoading(true);
    try {
      await removeMemberFromClub(club.id, userId, adminId);
      setClubMembers((prevMembers) =>
        prevMembers.filter((member) => member.userId !== userId)
      );
    } catch (error) {
      setErrorMessage("Failed to remove member. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFriend = async (targetUserId) => {
    setIsLoading(true);
    try {
      const isAlreadyFriend = friends.some(
        (friend) => friend.userId === targetUserId
      );

      if (isAlreadyFriend) {
        await removeFriend(userId, targetUserId);
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend.userId !== targetUserId)
        );
      } else {
        await sendFriendRequest(userId, targetUserId);
      }
    } catch (error) {
      setErrorMessage(
        "Failed to toggle friend status. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.clubDetailsWrapper}>
      <img
        className={styles.clubImage}
        src={club.image ? UPLOADS + club.image : book_club}
        alt={club.name}
      />

      <h2 className={styles.clubDetailsHeader}>{club.name}</h2>
      <p className={styles.clubDescription}>{club.description}</p>
      <h3 className={styles.clubDetailsHeader}>Members:</h3>
      <ul className={styles.memberList}>
        {members.map((member) => (
          <li
            className={styles.memberListItem}
            key={member.id}
            onClick={() => openModal(member)}
          >
            <img
              className={styles.memberAvatar}
              src={
                member.profileImage
                  ? UPLOADS + member.profileImage
                  : defaultAvatar
              }
              alt={member.name}
            />
            <span className={styles.memberName}>
              {member.name}{" "}
              {member.role === "admin" && (
                <span className={styles.memberRole}>{member.role}</span>
              )}
            </span>
            {isAdmin &&
              isClubMember &&
              member.role != "admin" &&
              member.userId != adminId && (
                <button
                  className={styles.removeMemberButton}
                  onClick={() => handleRemoveMember(member.userId)}
                >
                  Remove
                </button>
              )}
          </li>
        ))}
      </ul>

      {selectedMember && (
        <ProfileModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={closeModal}
          friends={friends}
          onToggleFriend={handleToggleFriend}
        />
      )}
    </div>
  );
};

export default ClubDetails;

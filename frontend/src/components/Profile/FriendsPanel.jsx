import { useEffect, useState } from "react";
import {
  getFriends,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "../../http/userApi";
import ProfileModal from "../modals/ProfileModal";
import defaultAvatar from "../../assets/images/profile_icon.png";
import styles from "../../styles/Profile.module.css";
import ErrorPage from "../../pages/ErrorPage";
import LoadingSpinner from "../LoadingSpinner";
const UPLOADS = import.meta.env.VITE_API_URL;

const FriendsPanel = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoadingFriends(true);
      try {
        const fetchedFriends = await getFriends(userId);
        setFriends(fetchedFriends);
      } catch (error) {
        setError("Error fetching friends.");
      } finally {
        setIsLoadingFriends(false);
      }
    };

    const fetchPendingRequests = async () => {
      setIsLoadingRequests(true);
      try {
        const fetchedRequests = await getPendingFriendRequests(userId);
        setPendingRequests(fetchedRequests);
      } catch (error) {
        setError("Error fetching pending requests.");
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchFriends();
    fetchPendingRequests();
  }, [userId]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);

      const newFriend = pendingRequests.find((req) => req.id === requestId);
      setFriends([...friends, newFriend]);

      setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
    } catch (error) {
      setError("Error accepting friend request.");
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await declineFriendRequest(requestId);
      setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
    } catch (error) {
      setError("Error declining friend request.");
    }
  };

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(userId, friendId);
      setFriends(friends.filter((friend) => friend.userId !== friendId));
      closeModal();
    } catch (error) {
      setError("Error removing friend.");
    }
  };

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className={styles.friendsPanel}>
      <h3>Friends</h3>
      {isLoadingFriends ? (
        <LoadingSpinner />
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} onClick={() => openModal(friend)}>
              <img
                src={
                  friend.profileImage
                    ? UPLOADS + `${friend.profileImage}`
                    : defaultAvatar
                }
                alt={`${friend.name}`}
              />
              <span>{friend.name}</span>
            </li>
          ))}
        </ul>
      )}

      <h3>Friend requests</h3>
      {isLoadingRequests ? (
        <LoadingSpinner />
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.id}>
              <img
                src={
                  request.profileImage
                    ? UPLOADS + `${request.profileImage}`
                    : defaultAvatar
                }
                alt={`${request.name}`}
              />
              <span>{request.name}</span>
              <button onClick={() => handleAcceptRequest(request.id)}>
                Accept
              </button>
              <button onClick={() => handleDeclineRequest(request.id)}>
                Decline
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedMember && (
        <ProfileModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={closeModal}
          friends={friends}
          onToggleFriend={handleRemoveFriend}
        />
      )}
    </div>
  );
};

export default FriendsPanel;

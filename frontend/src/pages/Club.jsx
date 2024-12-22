import { useState, useEffect } from "react";
import {
  getClubMembers,
  getChatMessages,
  addChatMessage,
  isUserInClub,
  getClub,
  joinToClub,
  leaveFromClub,
  isUserInAnyClub,
} from "../http/clubApi";
import styles from "../styles/Club.module.css";
import ClubDetails from "../components/Club/ClubDetails";
import ClubChat from "../components/Club/ClubChat";
import EditClub from "../components/Club/EditClub";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import { CLUBS_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";

const Club = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [clubMembers, setClubMembers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [error, setError] = useState(null);
  const [isInAnyClub, setIsInAnyClub] = useState(false);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;
  const isAuthenticated = !!userId;

  useEffect(() => {
    if (clubId) {
      const fetchClubDetails = async () => {
        try {
          const clubData = await getClub(clubId);
          setClub(clubData);
          const members = await getClubMembers(clubId);
          setClubMembers(members);
          const { isMember, role } = await isUserInClub(clubId, userId);
          setIsMember(isMember);
          setIsAdmin(role === "admin");

          if (isMember) {
            const messages = await getChatMessages(clubId, userId);
            setChatMessages(messages);
          }

          const inAnyClub = await isUserInAnyClub(userId);
          setIsInAnyClub(inAnyClub);
        } catch (error) {
          console.error("Error fetching club details:", error);
          setError(error.message || "Failed to fetch club details.");
        } finally {
          setLoading(false);
        }
      };

      fetchClubDetails();
    }
  }, [clubId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  const handleJoinClub = async () => {
    if (!isAuthenticated) {
      navigate(LOGIN_ROUTE);
      return;
    }
    await joinToClub(clubId, userId);
    const members = await getClubMembers(clubId);
    setClubMembers(members);
    setIsMember(true);

    const messages = await getChatMessages(clubId, userId);
    setChatMessages(messages);
  };

  const handleLeaveClub = async () => {
    if (!isAuthenticated) {
      navigate(LOGIN_ROUTE);
      return;
    }
    await leaveFromClub(clubId, userId);
    const members = await getClubMembers(clubId);
    setClubMembers(members);
    setIsMember(false);
    navigate(CLUBS_ROUTE);
  };

  return (
    <div className={styles.bookClubsContainer}>
      <div className={styles.clubDetailsWrapper}>
        {isAdmin && (
          <EditClub
            club={club}
            setClub={setClub}
            setIsEditingMode={setIsEditingMode}
          />
        )}

        {!isEditingMode && (
          <ClubDetails club={club} members={clubMembers} adminId={userId} />
        )}

        {isMember || isAdmin
          ? !isEditingMode && (
              <>
                <ClubChat
                  club={club}
                  messages={chatMessages}
                  onSendMessage={async (message) => {
                    await addChatMessage(clubId, userId, message);
                    const updatedMessages = await getChatMessages(
                      clubId,
                      userId
                    );
                    setChatMessages(updatedMessages);
                  }}
                />
                <button
                  className={styles.leaveClubButton}
                  onClick={handleLeaveClub}
                >
                  Leave Club
                </button>
              </>
            )
          : !isAuthenticated ||
            (!isInAnyClub && (
              <button
                className={styles.joinClubButton}
                onClick={handleJoinClub}
              >
                Join Club
              </button>
            ))}
      </div>
    </div>
  );
};

export default Club;

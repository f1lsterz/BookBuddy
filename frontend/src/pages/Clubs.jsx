import { useState, useEffect } from "react";
import { createClub, getAllClubs, isUserInAnyClub } from "../http/clubApi";
import styles from "../styles/Clubs.module.css";
import SearchClubs from "../components/Club/SearchClubs";
import { useNavigate } from "react-router-dom";
import CreateClubModal from "../components/modals/CreateClub";
import { jwtDecode } from "jwt-decode";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import { LOGIN_ROUTE } from "../utils/consts";
import book_club from "../assets/images/book_club.jpg";
const UPLOADS = import.meta.env.VITE_API_URL;

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInAnyClub, setUserInAnyClub] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;
  const isAuthenticated = !!userId;

  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        const allClubs = await getAllClubs();
        setClubs(allClubs);
        setFilteredClubs(allClubs);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
        setErrorMessage("Failed to load clubs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    const checkUserInClub = async () => {
      if (userId) {
        try {
          const isInClub = await isUserInAnyClub(userId);
          setUserInAnyClub(isInClub);
        } catch (error) {
          console.error("Failed to check user's club membership:", error);
        }
      }
    };

    checkUserInClub();
  }, [userId]);

  const handleCreateClub = async ({ clubName, description, image }) => {
    if (!isAuthenticated) {
      navigate(LOGIN_ROUTE);
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", clubName);
      formData.append("description", description);
      formData.append("adminId", userId);
      if (image) formData.append("image", image);

      const newClub = await createClub(formData);
      setClubs((prevClubs) => [...prevClubs, newClub]);
      setFilteredClubs((prevClubs) => [...prevClubs, newClub]);
      navigate(`/clubs/${newClub.id}`);
    } catch (error) {
      console.error("Failed to create club:", error);
      setErrorMessage("Failed to create a new club. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setFilteredClubs(results);
  };

  const handleClubSelection = (club) => {
    navigate(`/clubs/${club.id}`);
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div className={styles.bookClubsContainer}>
      {isLoading && <LoadingSpinner />}
      <div>
        <SearchClubs onResults={handleSearchResults} />
        {!isAuthenticated ||
          (!userInAnyClub && (
            <div className={styles.createClubButtonWrapper}>
              <button
                className={styles.createClubButton}
                onClick={() => setIsModalOpen(true)}
              >
                Create Club
              </button>
            </div>
          ))}
        <div className={styles.clubsWrapper}>
          <div className={styles.clubsList}>
            <h3>Found clubs</h3>
            {filteredClubs.length === 0 ? (
              <p>No clubs found. Be the first to create one!</p>
            ) : (
              filteredClubs.map((club) => (
                <div
                  key={club.id}
                  className={styles.clubCard}
                  onClick={() => handleClubSelection(club)}
                >
                  <img
                    src={club.image ? UPLOADS + club.image : book_club}
                    alt={`${club.name} logo`}
                    className={styles.clubLogo}
                  />
                  <h4>{club.name}</h4>
                  <p>Member`s count: {club.memberCount}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <CreateClubModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateClub={handleCreateClub}
      />
    </div>
  );
};

export default Clubs;

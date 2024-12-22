import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../main";
import { jwtDecode } from "jwt-decode";
import {
  getUserProfile,
  updateUserProfile,
  getUserClub,
} from "../http/userApi";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileDetails from "../components/Profile/ProfileDetails";
import EditProfileForm from "../components/Profile/EditProfileForm";
import FriendsPanel from "../components/Profile/FriendsPanel";
import styles from "../styles/Profile.module.css";
import { HOME_ROUTE, LIBRARY_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const { userId } = useParams();
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userClub, setUserClub] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const currentId = token ? jwtDecode(token).id : null;
  const isAuthenticated = !!currentId;

  useEffect(() => {
    if (!isAuthenticated && !currentId && userId === "null") {
      navigate(LOGIN_ROUTE);
    }
  }, [isAuthenticated, currentId, userId, navigate]);

  useEffect(() => {
    if (!userId || userId === "null") return;
    setProfile(null);
    setUserClub(null);
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await getUserProfile(userId);
        setProfile(fetchedProfile);
      } catch (error) {
        setError("Error fetching user profile. Please try again later.");
      }
    };

    const fetchUserClub = async () => {
      try {
        const fetchedClub = await getUserClub(userId);
        setUserClub(fetchedClub);
      } catch (error) {
        console.error("Error fetching user club:", error);
        setUserClub(null);
      }
    };

    fetchProfile();
    fetchUserClub();
  }, [userId]);

  const handleEditProfile = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);

  const handleSaveProfile = async (name, bio, favoriteGenres, profileImage) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("favoriteGenres", JSON.stringify(favoriteGenres));
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      const savedProfile = await updateUserProfile(userId, formData);
      setProfile(savedProfile);
      setIsEditing(false);
    } catch (error) {
      setError("Error saving profile. Please try again later.");
    }
  };

  const logout = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.clear();
    navigate(HOME_ROUTE);
  };

  const goToLibrary = () => {
    navigate(LIBRARY_ROUTE + `/${userId}`);
  };

  if (!profile) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        profile={profile}
        userClub={userClub}
        isOwnProfile={userId === profile.id}
        onEdit={handleEditProfile}
      />
      {isEditing ? (
        <EditProfileForm
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      ) : (
        <ProfileDetails profile={profile} />
      )}
      {currentId === profile.userId && <FriendsPanel userId={userId} />}
      <div className={styles.buttonsContainer}>
        {currentId === profile.id && (
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        )}
        {currentId === profile.id && (
          <button onClick={handleEditProfile} className={styles.editButton}>
            Edit Profile
          </button>
        )}
        {currentId !== profile.id && (
          <button onClick={goToLibrary} className={styles.libraryButton}>
            {`${profile.name}'s Library`}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  createCustomList,
  getUserLibraries,
  deleteCustomList,
  getBooksInList,
  updateListVisibility,
  removeBookFromLibrary,
} from "../http/libraryApi";
import { getFriends, getUserProfile } from "../http/userApi";
import DeleteListModal from "../components/modals/DeleteList";
import AddListModal from "../components/modals/AddList";
import styles from "../styles/Library.module.css";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import { LOGIN_ROUTE } from "../utils/consts";

const Library = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [customListName, setCustomListName] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const [selectedList, setSelectedList] = useState(null);
  const [books, setBooks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFriend, setIsFriend] = useState(null);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const currentId = token ? jwtDecode(token).id : null;
  const isAuthenticated = !!currentId;
  const isOwner = currentId == userId;

  useEffect(() => {
    if (!isAuthenticated && !currentId && userId === "null") {
      navigate(LOGIN_ROUTE);
    }
  }, [isAuthenticated, currentId, userId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || userId === "null") return;
      setLoading(true);
      try {
        if (userId) {
          setSelectedList(null);
          const profile = await getUserProfile(userId);
          setUserName(profile.name);
          if (!isOwner) {
            const friends = await getFriends(userId);
            const isFriendCheck = friends.some(
              (friend) => String(friend.userId) === String(currentId)
            );
            setIsFriend(isFriendCheck);
          } else {
            setIsFriend(true);
          }

          const data = await getUserLibraries(userId);

          const filteredLibraries = data.lists.filter((list) => {
            if (list.visibility === "Public") return true;
            if (list.visibility === "Friends" && isFriend) return true;
            if (isOwner) return true;
            return false;
          });
          setLibrary(filteredLibraries);
        }
      } catch (err) {
        setError("An error occurred while fetching library data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, currentId, isOwner, isFriend]);

  const handleAddCustomList = async () => {
    setLoading(true);
    try {
      if (!customListName) return alert("Input list name!");
      const newList = await createCustomList(
        userId,
        customListName,
        visibility
      );
      setLibrary([...library, newList]);
      setCustomListName("");
      setShowAddListModal(false);
    } catch (err) {
      setError("An error occurred while adding the custom list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomList = async () => {
    setLoading(true);
    if (listToDelete) {
      await deleteCustomList(userId, listToDelete.id);
      setLibrary(library.filter((list) => list.id !== listToDelete.id));
      if (selectedList && selectedList.id === listToDelete.id) {
        setSelectedList(null);
        setBooks([]);
      }

      setShowDeleteModal(false);
    }
    setLoading(false);
  };

  const handleDeleteBook = async () => {
    setLoading(true);
    if (bookToDelete) {
      await removeBookFromLibrary(bookToDelete.id, selectedList.id);
      setBooks(books.filter((book) => book.id !== bookToDelete.id));
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
    setLoading(false);
  };

  const handleSelectList = async (listId) => {
    setLoading(true);
    const selected = library.find((list) => list.id === listId);
    setSelectedList(selected);
    const booksInList = await getBooksInList(userId, listId);
    setBooks(booksInList || []);
    setLoading(false);
  };

  const handleVisibilityChange = (e) => {
    setVisibility(e.target.value);
  };

  const handleSaveVisibilityChange = async () => {
    setLoading(true);
    if (selectedList) {
      await updateListVisibility(userId, selectedList.id, visibility);
      setSelectedList({ ...selectedList, visibility });
    }
    setLoading(false);
  };

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className={styles.libraryContainer}>
      <h1>{isOwner ? "My Library" : `${userName}'s Library`}</h1>

      {loading && <LoadingSpinner />}

      {isOwner && (
        <div className={styles.headerActions}>
          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              if (isEditMode) {
                handleSaveVisibilityChange();
              }
            }}
          >
            {isEditMode ? "End editing" : "Edit"}
          </button>
        </div>
      )}

      {library.length === 0 ? (
        <div className={styles.noLibraryMessage}>
          <p>All lists are private</p>
        </div>
      ) : (
        <div className={styles.listsContainer}>
          <div className={styles.listsSidebar}>
            {library.map((list) => (
              <div
                key={list.id}
                className={styles.libraryListItem}
                onClick={() => handleSelectList(list.id)}
              >
                <h2>{list.customListName || list.status}</h2>
                {isOwner && isEditMode && list.customListName && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setListToDelete(list);
                      setShowDeleteModal(true);
                    }}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={styles.booksContainer}>
            {selectedList ? (
              <>
                <h2>{selectedList.customListName || selectedList.status}</h2>
                <p>Visibility: {selectedList.visibility}</p>

                {isOwner && isEditMode && (
                  <div className={styles.visibilityEdit}>
                    <select
                      id="visibility"
                      value={visibility}
                      onChange={handleVisibilityChange}
                    >
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                      <option value="Friends">Friends</option>
                    </select>
                  </div>
                )}

                <div className={styles.booksList}>
                  {books.length > 0 ? (
                    books.map((book) => (
                      <div key={book.id} className={styles.bookItem}>
                        {book.coverImage && (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className={styles.bookImage}
                          />
                        )}
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>

                        {isOwner && isEditMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookToDelete(book);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>This list is empty.</p>
                  )}
                </div>
              </>
            ) : (
              <p>Choose list to watch.</p>
            )}
          </div>
        </div>
      )}

      {isOwner && isEditMode && (
        <div className={styles.addListForm}>
          <button onClick={() => setShowAddListModal(true)}>
            Create new list
          </button>
        </div>
      )}

      <DeleteListModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={bookToDelete ? handleDeleteBook : handleDeleteCustomList}
        message={
          bookToDelete
            ? "You sure delete this book?"
            : "You sure delete this library?"
        }
      />
      <AddListModal
        isOpen={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        onAddList={handleAddCustomList}
        customListName={customListName}
        setCustomListName={setCustomListName}
        visibility={visibility}
        setVisibility={setVisibility}
      />
    </div>
  );
};

export default Library;

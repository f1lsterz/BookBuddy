import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBookById,
  getCommentsForBook,
  addCommentToBook,
  deleteComment,
  toggleCommentReaction,
} from "../http/bookApi";
import { getFriends, removeFriend, sendFriendRequest } from "../http/userApi";
import ManageBookToLibrary from "../components/Book/ManageBookToLibrary";
import Pagination from "../components/Pagination";
import BookDetails from "../components/Book/BookDetails";
import PageContent from "../components/Book/PageContent";
import BookRating from "../components/Book/BookRating";
import { getUserLibraries } from "../http/libraryApi";
import { jwtDecode } from "jwt-decode";
import styles from "../styles/Book.module.css";
import default_avatar from "../assets/images/profile_icon.png";
import { LOGIN_ROUTE } from "../utils/consts";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileModal from "../components/modals/ProfileModal";
const UPLOADS = import.meta.env.VITE_API_URL;

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [libraries, setLibraries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  const isAuthenticated = !!userId;

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchLibraries = async () => {
      try {
        const data = await getUserLibraries(userId);
        setLibraries(data.lists || []);
      } catch (error) {
        setError("Failed to fetch libraries");
      }
    };

    const fetchFriends = async () => {
      setLoading(true);
      try {
        const friendsList = await getFriends(userId);
        setFriends(friendsList);
      } catch (error) {
        setError("Failed to load friends. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
    fetchLibraries();
  }, [userId, isAuthenticated]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookData = await getBookById(bookId);
        setBook(bookData);
        setMaxPages(bookData.pages || 0);
      } catch (err) {
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  const fetchComments = async () => {
    try {
      const commentsData = await getCommentsForBook(bookId);
      setComments(commentsData || []);
    } catch (err) {
      setError("Failed to fetch comments");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      if (!isAuthenticated) {
        navigate(LOGIN_ROUTE);
        return;
      }
      try {
        await addCommentToBook(bookId, userId, newComment);
        setNewComment("");
        fetchComments();
      } catch (err) {
        setError("Failed to add comment");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      navigate(LOGIN_ROUTE);
      return;
    }
    try {
      await deleteComment(commentId, userId);
      fetchComments();
    } catch (err) {
      setError("Failed to delete comment");
    }
  };

  const handleToggleReaction = async (commentId, reactionType) => {
    if (!isAuthenticated) {
      navigate(LOGIN_ROUTE);
      return;
    }
    try {
      const updatedComment = await toggleCommentReaction(
        commentId,
        userId,
        reactionType
      );

      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              likes: updatedComment.likes,
              dislikes: updatedComment.dislikes,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      setError("Failed to toggle reaction");
    }
  };

  const handleOpenProfileModal = (member) => {
    if (member.userId !== userId) {
      setSelectedMember(member);
      setIsModalOpen(true);
    }
  };

  const handleToggleFriend = async (targetUserId) => {
    if (!isAuthenticated) {
      navigate(LOGIN_ROUTE);
      return;
    }
    setLoading(true);
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
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div className={styles.bookContainer}>
      <BookDetails book={book} userId={userId} />
      {book.pages != 0 && (
        <PageContent pages={book.pages} currentPage={currentPage} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={maxPages}
        onPageChange={handlePageChange}
      />

      <div className={styles.ratingAndLibraryContainer}>
        <BookRating bookId={book.id} userId={userId} />
        {isAuthenticated && (
          <ManageBookToLibrary bookId={bookId} libraries={libraries} />
        )}
      </div>

      <div className={styles.commentsSection}>
        <h3>Comments</h3>
        <div className={styles.commentsList}>
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => {
              const userName = comment.user?.name || "Anonymous";
              return (
                <div key={comment.commentId} className={styles.comment}>
                  <div
                    className={styles.commentHeader}
                    onClick={() => handleOpenProfileModal(comment.user)}
                  >
                    <img
                      src={
                        comment.user.profileImage
                          ? UPLOADS + comment.user.profileImage
                          : default_avatar
                      }
                      alt={comment.user.name ? comment.user.name : "Anonymous"}
                      className={styles.commentUserImage}
                    />
                    <strong>{userName}</strong>
                  </div>
                  <p>{comment.comment}</p>
                  <div className={styles.commentActions}>
                    <button
                      onClick={() =>
                        handleToggleReaction(comment.commentId, "like")
                      }
                    >
                      Like ({comment.likes})
                    </button>
                    <button
                      onClick={() =>
                        handleToggleReaction(comment.commentId, "dislike")
                      }
                    >
                      Dislike ({comment.dislikes})
                    </button>
                    {comment.user.userId === userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No comments yet</p>
          )}
        </div>
        {isAuthenticated && (
          <div className={styles.addComment}>
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Submit</button>
          </div>
        )}
      </div>
      {selectedMember && (
        <ProfileModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          friends={friends}
          onToggleFriend={handleToggleFriend}
        />
      )}
    </div>
  );
};

export default Book;

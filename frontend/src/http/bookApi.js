import { $authHost, $host } from "./index";

export const fetchBooks = async (
  page = 1,
  limit = 10,
  sortBy = "title",
  order = "ASC",
  query = ""
) => {
  try {
    const { data } = await $host.get(`/api/books/`, {
      params: { page, limit, sortBy, order, query },
    });
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error.response?.data || error.message;
  }
};

export const getBookById = async (bookId) => {
  try {
    const { data } = await $host.get(`/api/books/${bookId}`);
    return data;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw error.response?.data || error.message;
  }
};

export const fetchAndStoreBooks = async (searchQuery) => {
  try {
    const { data } = await $authHost.post(`/api/books/fetch`, { searchQuery });
    return data;
  } catch (error) {
    console.error("Error fetching and storing books:", error);
    throw error.response?.data || error.message;
  }
};

export const searchBooks = async (query) => {
  try {
    const { data } = await $host.get(`/api/books/search`, {
      params: { query },
    });
    return data;
  } catch (error) {
    console.error("Error searching books:", error);
    throw error.response?.data || error.message;
  }
};

export const addCommentToBook = async (bookId, userId, commentText) => {
  try {
    const { data } = await $authHost.post(`/api/books/${bookId}/comments`, {
      userId,
      commentText,
    });
    return data;
  } catch (error) {
    console.error("Error adding comment to book:", error);
    throw error.response?.data || error.message;
  }
};

export const getCommentsForBook = async (bookId) => {
  try {
    const { data } = await $host.get(`/api/books/${bookId}/comments`);
    return data;
  } catch (error) {
    console.error("Error fetching comments for book:", error);
    throw error.response?.data || error.message;
  }
};

export const deleteComment = async (commentId, userId) => {
  try {
    const { data } = await $authHost.delete(
      `/api/books/comments/${commentId}/${userId}`
    );
    return data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error.response?.data || error.message;
  }
};

export const toggleCommentReaction = async (
  commentId,
  userId,
  reactionType
) => {
  const comment = await $authHost.post(
    `/api/books/comments/${commentId}/reaction`,
    {
      userId,
      reactionType,
    }
  );
  return comment.data;
};

export const getBookRating = async (bookId, userId) => {
  try {
    const { data } = await $authHost.get(
      `/api/books/${bookId}/${userId}/rating`
    );
    return data;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw error.response?.data || error.message;
  }
};

export const saveBookRating = async (bookId, userId, rating) => {
  try {
    const { data } = await $authHost.post(
      `/api/books/${bookId}/${userId}/rating`,
      { rating: rating }
    );
    return data;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw error.response?.data || error.message;
  }
};

export const deleteBookRating = async (bookId, userId) => {
  try {
    const { data } = await $authHost.delete(
      `/api/books/${bookId}/${userId}/rating`
    );
    return data;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw error.response?.data || error.message;
  }
};

export const getAverageRating = async (bookId) => {
  try {
    const { data } = await $host.get(`/api/books/${bookId}/avgrating`);
    return data;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw error.response?.data || error.message;
  }
};

export const getRecommendedBooks = async (userId) => {
  const { data } = await $host.get(`/api/books/${userId}/recommended`);
  return data;
};

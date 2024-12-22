import { $authHost, $host } from "./index";

export const getUserLibraries = async (userId) => {
  const { data } = await $authHost.get(`/api/library/${userId}`);
  return data;
};

export const createCustomList = async (userId, customListName, visibility) => {
  const { data } = await $authHost.post("/api/library/custom", {
    userId,
    customListName,
    visibility,
  });
  return data;
};

export const deleteCustomList = async (userId, listId) => {
  await $authHost.delete(`/api/library/custom/${userId}/${listId}`);
};

export const getBooksInList = async (userId, listId) => {
  const { data } = await $authHost.get(
    `/api/library/lists/${userId}/${listId}`
  );
  return data;
};

export const addBookToLibrary = async (bookId, libraryId) => {
  await $authHost.post(`/api/library/lists/${bookId}/${libraryId}`);
};

export const removeBookFromLibrary = async (bookId, libraryId) => {
  await $authHost.delete(`/api/library/lists/${bookId}/${libraryId}`);
};

export const checkBookInLibrary = async (bookId, libraryId) => {
  const { data } = await $authHost.get(
    `/api/library/lists/check/${bookId}/${libraryId}`
  );
  return data;
};

export const updateListVisibility = async (userId, libraryId, visibility) => {
  await $authHost.put(`/api/library/lists/visibility/${userId}/${libraryId}`, {
    visibility,
  });
};

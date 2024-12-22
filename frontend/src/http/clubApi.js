import { $authHost, $host } from "./index";

export const createClub = async (formData) => {
  const { data } = await $authHost.post("/api/clubs/create", formData);
  return data;
};

export const getAllClubs = async () => {
  const { data } = await $host.get("/api/clubs");
  return data;
};

export const isUserInClub = async (clubId, userId) => {
  const { data } = await $authHost.get(
    `/api/clubs/${clubId}/members/${userId}/check`
  );
  return data;
};

export const isUserInAnyClub = async (userId) => {
  const { data } = await $authHost.get(`/api/clubs/${userId}/check`);
  return data.isInClub;
};

export const searchClubs = async (query, filterFull = false) => {
  const { data } = await $host.get("/api/clubs/search", {
    params: { query, filterFull },
  });
  return data;
};

export const getClub = async (clubId) => {
  const { data } = await $host.get(`/api/clubs/${clubId}`);
  return data;
};

export const updateClub = async (clubId, updates) => {
  const { data } = await $authHost.put(`/api/clubs/${clubId}/edit`, updates);
  return data;
};

export const joinToClub = async (clubId, memberId) => {
  const { data } = await $authHost.post(
    `/api/clubs/${clubId}/${memberId}/members`
  );
  return data;
};

export const leaveFromClub = async (clubId, memberId) => {
  const { data } = await $authHost.delete(
    `/api/clubs/${clubId}/${memberId}/members`
  );
  return data;
};

export const removeMemberFromClub = async (clubId, userId, adminId) => {
  const { data } = await $authHost.delete(
    `/api/clubs/${clubId}/${adminId}/${userId}/members`
  );
  return data;
};

export const getClubMembers = async (clubId) => {
  const { data } = await $host.get(`/api/clubs/${clubId}/members`);
  return data;
};

export const addChatMessage = async (clubId, userId, message) => {
  const { data } = await $authHost.post(
    `/api/clubs/${clubId}/${userId}/messages`,
    { text: message }
  );
  return data;
};

export const getChatMessages = async (
  clubId,
  userId,
  limit = 10,
  offset = 0
) => {
  const { data } = await $authHost.get(
    `/api/clubs/${clubId}/${userId}/messages`,
    {
      params: { limit, offset },
    }
  );
  return data;
};

import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password, name) => {
  const { data } = await $host.post("/api/users/registration", {
    email,
    password,
    role: "USER",
    name,
  });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post("/api/users/login", { email, password });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const getUserProfile = async (userId) => {
  try {
    const { data } = await $host.get(`/api/users/profile/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const getUserClub = async (userId) => {
  try {
    const { data } = await $host.get(`/api/users/profile/${userId}/club`);
    return data;
  } catch (error) {
    console.error("Error fetching user club:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profile) => {
  try {
    const response = await $authHost.put(
      `/api/users/profile/${userId}`,
      profile
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const { data } = await $authHost.post(`/api/users/friends/request`, {
      senderId,
      receiverId,
    });
    return data;
  } catch (error) {
    console.error("Error fetching user friends:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (requestId) => {
  try {
    const { data } = await $authHost.put(
      `/api/users/friends/accept/${requestId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching user club:", error);
    throw error;
  }
};

export const declineFriendRequest = async (requestId) => {
  try {
    const { data } = await $authHost.put(
      `/api/users/friends/decline/${requestId}`
    );
    return data;
  } catch (error) {
    console.error("Error declining friend request:", error);
    throw error;
  }
};

export const removeFriend = async (userId1, userId2) => {
  try {
    const { data } = await $authHost.post(`/api/users/friends/remove`, {
      userId1,
      userId2,
    });
    return data;
  } catch (error) {
    console.error("Error toggling friendship:", error);
    throw error;
  }
};

export const getFriends = async (userId) => {
  try {
    const { data } = await $authHost.get(`/api/users/friends/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const getPendingFriendRequests = async (receiverId) => {
  try {
    const { data } = await $authHost.get(
      `/api/users/friends/pending-requests/${receiverId}`
    );
    return data || [];
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    throw error;
  }
};

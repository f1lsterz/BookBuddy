import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserProfile from "./userProfile.js";
import FriendRequest from "./friendRequest.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

User.belongsToMany(User, {
  through: "UserFriends",
  as: "friends",
  foreignKey: "userId",
  otherKey: "friendId",
});

UserProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(UserProfile, {
  foreignKey: "userId",
  as: "profile",
});

User.hasMany(FriendRequest, { foreignKey: "senderId", as: "sentRequests" });
User.hasMany(FriendRequest, {
  foreignKey: "receiverId",
  as: "receivedRequests",
});
FriendRequest.belongsTo(User, { foreignKey: "senderId", as: "sender" });
FriendRequest.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });
export default User;

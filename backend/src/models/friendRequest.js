import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FriendRequest = sequelize.define("FriendRequest", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "declined"),
    allowNull: false,
    defaultValue: "pending",
  },
});

export default FriendRequest;

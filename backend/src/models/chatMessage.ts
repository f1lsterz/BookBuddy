import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import BookClub from "./bookClub.js";
import User from "./user.js";

const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

export default ChatMessage;

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    dislikes: { type: DataTypes.INTEGER, defaultValue: 0 },
    comment: { type: DataTypes.STRING, allowNull: false },
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

Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
});

export default Comment;

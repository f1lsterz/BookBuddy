import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Comment from "./comment.js";

const CommentReaction = sequelize.define(
  "CommentReaction",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reaction: { type: DataTypes.ENUM("like", "dislike"), allowNull: false },
  },
  {
    timestamps: false,
  }
);

CommentReaction.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });
CommentReaction.belongsTo(User, { foreignKey: "userId", as: "user" });

Comment.hasMany(CommentReaction, { foreignKey: "commentId", as: "reactions" });
User.hasMany(CommentReaction, { foreignKey: "userId", as: "reactions" });

export default CommentReaction;

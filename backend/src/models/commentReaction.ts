import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Comment from "./comment.js";
import { REACTION_TYPE } from "../utils/reactionType.js";

const CommentReaction = sequelize.define(
  "CommentReaction",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reaction: {
      type: DataTypes.ENUM(...Object.values(REACTION_TYPE)),
      allowNull: false,
      validate: {
        isIn: [Object.values(REACTION_TYPE)],
      },
    },
  },
  {
    tableName: "comment_reactions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "commentId"],
      },
    ],
  }
);

export default CommentReaction;

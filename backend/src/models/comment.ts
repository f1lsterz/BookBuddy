import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },

    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    comment: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "comments",
    indexes: [
      {
        fields: ["userId"],
      },
    ],
  }
);

export default Comment;

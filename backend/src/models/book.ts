import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Library from "./library.js";
import Comment from "./comment.js";

const Book = sequelize.define(
  "Book",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title cannot be empty" },
        len: {
          args: [1, 200],
          msg: "Title must be between 1 and 200 characters",
        },
      },
    },
    author: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Author cannot be empty" },
        len: {
          args: [1, 150],
          msg: "Author name must be between 1 and 150 characters",
        },
      },
    },
    genres: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isArrayOfStrings(value: any) {
          if (value && !Array.isArray(value)) {
            throw new Error("Genres must be an array");
          }
          if (value && value.some((g) => typeof g !== "string")) {
            throw new Error("All genres must be strings");
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: "Description must be at most 5000 characters",
        },
      },
    },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    publicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: "Must be a valid date (YYYY-MM-DD)",
        },
        isPastDate(value: string) {
          if (value && new Date(value) > new Date()) {
            throw new Error("Publication date cannot be in the future");
          }
        },
      },
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: "Pages must be at least 1",
        },
        isInt: {
          msg: "Pages must be an integer",
        },
      },
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Rating cannot be less than 0",
        },
        max: {
          args: [5],
          msg: "Rating cannot exceed 5",
        },
      },
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Comment count cannot be negative",
        },
        isInt: {
          msg: "Comment count must be an integer",
        },
      },
    },
  },
  {
    tableName: "books",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["title", "author"],
      },
    ],
  }
);

export default Book;

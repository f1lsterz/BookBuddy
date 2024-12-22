import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Library from "./library.js";
import Comment from "./comment.js";

const Book = sequelize.define(
  "Book",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    genres: { type: DataTypes.JSON, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    publicationDate: { type: DataTypes.DATEONLY, allowNull: true },
    pages: { type: DataTypes.INTEGER, allowNull: true },
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    commentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false }
);

Book.hasMany(Comment, {
  foreignKey: "bookId",
  as: "comments",
});

Comment.belongsTo(Book, {
  foreignKey: "bookId",
  as: "book",
});

Book.belongsToMany(Library, {
  through: "LibraryBooks",
  foreignKey: "bookId",
  otherKey: "libraryId",
  as: "libraries",
});

Library.belongsToMany(Book, {
  through: "LibraryBooks",
  foreignKey: "libraryId",
  otherKey: "bookId",
  as: "books",
});

export default Book;

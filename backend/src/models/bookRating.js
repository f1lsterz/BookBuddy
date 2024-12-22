import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Book from "./book.js";

const BookRating = sequelize.define(
  "BookRating",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: false,
  }
);

BookRating.belongsTo(Book, { foreignKey: "bookId", as: "book" });
BookRating.belongsTo(User, { foreignKey: "userId", as: "user" });

Book.hasMany(BookRating, { foreignKey: "bookId", as: "ratings" });
User.hasMany(BookRating, { foreignKey: "userId", as: "ratings" });

export default BookRating;

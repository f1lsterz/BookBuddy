import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Book from "./book.js";

const BookRating = sequelize.define(
  "BookRating",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
        max: 5,
      },
    },
  },
  {
    tableName: "BookRatings",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "bookId"],
      },
    ],
    underscored: true,
  }
);

export default BookRating;

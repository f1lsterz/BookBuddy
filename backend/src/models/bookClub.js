import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const BookClub = sequelize.define(
  "bookclubs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: false,
  }
);

export default BookClub;

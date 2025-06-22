import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { MAX_CLUB_MEMBERS } from "../utils/constants.js";

const BookClub = sequelize.define(
  "bookclubs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 1000],
      },
    },
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        isInt: true,
        isBelowMax(value: number) {
          if (value > MAX_CLUB_MEMBERS) {
            throw new Error(`memberCount cannot exceed ${MAX_CLUB_MEMBERS}`);
          }
        },
      },
    },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "book_clubs",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
  }
);

export default BookClub;

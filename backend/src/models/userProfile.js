import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserProfile = sequelize.define(
  "UserProfile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    bio: { type: DataTypes.TEXT, allowNull: true },
    profileImage: { type: DataTypes.STRING, allowNull: true },
    favoriteGenres: { type: DataTypes.JSON, allowNull: true },
  },
  {
    timestamps: false,
  }
);

export default UserProfile;

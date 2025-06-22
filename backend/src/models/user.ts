import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import FriendRequest from "./friendRequest.js";
import { ROLES } from "../utils/enums/roles.js";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [5, 100],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100],
      },
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ROLES)),
      defaultValue: ROLES.USER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500],
      },
    },
    profileImage: { type: DataTypes.STRING, allowNull: true },
    favoriteGenres: { type: DataTypes.JSON, allowNull: true },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "users",
  }
);

export default User;

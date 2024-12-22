import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Library = sequelize.define(
  "Library",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: {
      type: DataTypes.ENUM(
        "Favourite",
        "Reading",
        "Already read",
        "Wanna read",
        "Dropped",
        "Custom"
      ),
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM("Private", "Friends", "Public"),
      defaultValue: "Private",
    },
    customListName: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: false,
  }
);

Library.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Library, {
  foreignKey: "userId",
  as: "libraries",
});

export default Library;

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import BookClub from "./bookClub.js";

const ClubMembers = sequelize.define(
  "ClubMembers",
  {
    role: {
      type: DataTypes.ENUM("admin", "member"),
      allowNull: false,
      defaultValue: "member",
    },
  },
  {
    timestamps: false,
  }
);

export default ClubMembers;

BookClub.hasMany(ClubMembers, {
  foreignKey: "clubId",
  as: "clubMembers",
  onDelete: "CASCADE",
});
ClubMembers.belongsTo(BookClub, {
  foreignKey: "clubId",
  as: "club",
  onDelete: "CASCADE",
});

User.hasOne(ClubMembers, {
  foreignKey: "userId",
  as: "clubMembership",
  onDelete: "CASCADE",
});
ClubMembers.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

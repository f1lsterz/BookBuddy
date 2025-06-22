import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import BookClub from "./bookClub.js";
import { CLUB_MEMBER_ROLE } from "../utils/clubMember.js";

const ClubMembers = sequelize.define(
  "ClubMembers",
  {
    role: {
      type: DataTypes.ENUM(...Object.values(CLUB_MEMBER_ROLE)),
      allowNull: false,
      defaultValue: CLUB_MEMBER_ROLE.MEMBER,
      validate: {
        isIn: [Object.values(CLUB_MEMBER_ROLE)],
      },
    },
  },
  {
    tableName: "club_members",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "clubId"],
      },
    ],
    underscored: true,
  }
);

export default ClubMembers;

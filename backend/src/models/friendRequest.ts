import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { FRIEND_REQUEST_STATUS } from "../utils/enums/friendRequestStatus.js";

const FriendRequest = sequelize.define(
  "FriendRequest",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(FRIEND_REQUEST_STATUS)),
      allowNull: false,
      defaultValue: FRIEND_REQUEST_STATUS.PENDING,
      validate: {
        isIn: [Object.values(FRIEND_REQUEST_STATUS)],
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "friend_requests",
    indexes: [
      {
        unique: true,
        fields: ["senderId", "receiverId"],
      },
    ],
  }
);

export default FriendRequest;

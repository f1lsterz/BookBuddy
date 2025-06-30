import { ROLES } from "../utils/enums/roles.js";
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import ClubMembers from "./clubMembers.js";
import ChatMessage from "./chatMessage.js";
import BookRating from "./bookRating.js";
import CommentReaction from "./commentReaction.js";
import FriendRequest from "./friendRequest.js";
import Library from "./library.js";
import Comment from "./comment.js";

@Table({
  tableName: "users",
  timestamps: true,
  underscored: true,
})
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(100),
    validate: {
      isEmail: true,
      notEmpty: true,
      len: [5, 100],
    },
  })
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      notEmpty: true,
      len: [6, 100],
    },
  })
  password!: string;

  @AllowNull(false)
  @Default(ROLES.USER)
  @Column(DataType.ENUM(...Object.values(ROLES)))
  role!: ROLES;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  })
  name!: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 500],
    },
  })
  bio!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  profileImage!: string | null;

  @AllowNull(true)
  @Column(DataType.JSON)
  favoriteGenres!: string[] | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @HasMany(() => Library, { foreignKey: "userId", as: "libraries" })
  libraries!: Library[];

  @HasMany(() => FriendRequest, { foreignKey: "senderId", as: "sentRequests" })
  sentRequests!: FriendRequest[];

  @HasMany(() => FriendRequest, {
    foreignKey: "receiverId",
    as: "receivedRequests",
  })
  receivedRequests!: FriendRequest[];

  @HasMany(() => Comment, { foreignKey: "userId", as: "comments" })
  comments!: Comment[];

  @HasMany(() => CommentReaction, { foreignKey: "userId", as: "reactions" })
  commentReactions!: CommentReaction[];

  @HasMany(() => BookRating, { foreignKey: "userId", as: "ratings" })
  ratings!: BookRating[];

  @HasMany(() => ChatMessage, { foreignKey: "userId", as: "sentMessages" })
  sentMessages!: ChatMessage[];

  @HasMany(() => ClubMembers, { foreignKey: "userId", as: "clubMembership" })
  clubMembership!: ClubMembers[];

  @BelongsToMany(() => User, {
    through: "UserFriends",
    as: "friends",
    foreignKey: "userId",
    otherKey: "friendId",
  })
  friends!: User[];
}

export default User;

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  Index,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { REACTION_TYPE } from "../utils/enums/reactionType.js";
import User from "./user.js";
import Comment from "./comment.js";

@Table({
  tableName: "comment_reactions",
  timestamps: true,
  underscored: true,
})
class CommentReaction extends Model<CommentReaction> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(REACTION_TYPE)))
  reaction!: REACTION_TYPE;

  @AllowNull(false)
  @Index({ name: "unique_user_comment", unique: true })
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User, { as: "user" })
  user!: User;

  @AllowNull(false)
  @Index({ name: "unique_user_comment", unique: true })
  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  commentId!: number;

  @BelongsTo(() => Comment, { as: "comment" })
  comment!: Comment;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default CommentReaction;

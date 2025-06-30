import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  Index,
  BelongsTo,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";
import User from "./user";
import Book from "./book";
import CommentReaction from "./commentReaction";

@Table({
  tableName: "comments",
  timestamps: true,
  underscored: true,
})
class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isInt: true,
      min: 0,
    },
  })
  likes!: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isInt: true,
      min: 0,
    },
  })
  dislikes!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(1000),
    validate: {
      notEmpty: true,
      len: [1, 1000],
    },
  })
  comment!: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @AllowNull(false)
  @Index
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User, { as: "user" })
  user!: User;

  @AllowNull(false)
  @Index
  @ForeignKey(() => Book)
  @Column(DataType.INTEGER)
  bookId!: number;

  @BelongsTo(() => Book, { as: "book" })
  book!: Book;

  @HasMany(() => CommentReaction, { as: "reactions" })
  reactions!: CommentReaction[];
}

export default Comment;

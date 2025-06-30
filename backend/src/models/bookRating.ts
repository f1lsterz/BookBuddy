import User from "./user.js";
import Book from "./book.js";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "book_ratings",
  timestamps: true,
  underscored: true,
})
export class BookRating extends Model<BookRating> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
    validate: {
      isFloat: true,
      min: 0,
      max: 5,
    },
  })
  rating!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Index({ name: "user_book_unique", unique: true })
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User, {
    as: "user",
  })
  user!: User;

  @AllowNull(false)
  @ForeignKey(() => Book)
  @Index({ name: "user_book_unique", unique: true })
  @Column(DataType.INTEGER)
  bookId!: number;

  @BelongsTo(() => Book, {
    as: "book",
  })
  book!: Book;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default BookRating;

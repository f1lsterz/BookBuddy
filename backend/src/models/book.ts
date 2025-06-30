import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import Library from "./library";
import BookRating from "./bookRating";
import Comment from "./comment";

@Table({
  tableName: "books",
  timestamps: true,
  underscored: true,
})
class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(200),
    validate: {
      notEmpty: {
        msg: "Title cannot be empty",
      },
      len: {
        args: [1, 200],
        msg: "Title must be between 1 and 200 characters",
      },
    },
  })
  title!: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(150),
    validate: {
      notEmpty: {
        msg: "Author cannot be empty",
      },
      len: {
        args: [1, 150],
        msg: "Author name must be between 1 and 150 characters",
      },
    },
  })
  author!: string;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
  })
  genres!: string[] | null;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    validate: {
      len: {
        args: [0, 5000],
        msg: "Description must be at most 5000 characters",
      },
    },
  })
  description!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  coverImage!: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.DATEONLY,
    validate: {
      isDate: {
        args: true,
        msg: "Must be a valid date (YYYY-MM-DD)",
      },
      isPastDate(value: string) {
        if (value && new Date(value) > new Date()) {
          throw new Error("Publication date cannot be in the future");
        }
      },
    },
  })
  publicationDate!: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isInt: {
        msg: "Pages must be an integer",
      },
      min: {
        args: [1],
        msg: "Pages must be at least 1",
      },
    },
  })
  pages!: number | null;

  @Default(0)
  @Column({
    type: DataType.FLOAT,
    validate: {
      min: {
        args: [0],
        msg: "Rating cannot be less than 0",
      },
      max: {
        args: [5],
        msg: "Rating cannot exceed 5",
      },
    },
  })
  averageRating!: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isInt: {
        msg: "Comment count must be an integer",
      },
      min: {
        args: [0],
        msg: "Comment count cannot be negative",
      },
    },
  })
  commentCount!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @HasMany(() => Comment)
  comments!: Comment[];

  @HasMany(() => BookRating)
  ratings!: BookRating[];

  @BelongsToMany(() => Library, {
    through: "LibraryBooks",
    foreignKey: "bookId",
    otherKey: "libraryId",
    as: "libraries",
  })
  libraries!: Library[];
}

export default Book;

import { LIBRARY_STATUS } from "../utils/enums/libraryStatus.js";
import { LIBRARY_VISIBILITY } from "../utils/enums/libraryVisibility.js";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import Book from "./book.js";
import User from "./user.js";

@Table({
  tableName: "libraries",
  timestamps: true,
  underscored: true,
})
class Library extends Model<Library> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Default(DataType.ENUM(...Object.values(LIBRARY_STATUS)))
  status!: LIBRARY_STATUS;

  @AllowNull(false)
  @Default(LIBRARY_VISIBILITY.PRIVATE)
  @Column(DataType.ENUM(...Object.values(LIBRARY_VISIBILITY)))
  visibility!: LIBRARY_VISIBILITY;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    validate: {
      len: [0, 100],
    },
  })
  customListName!: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User, { as: "user" })
  user!: User;

  @BelongsToMany(() => Book, {
    through: "LibraryBooks",
    foreignKey: "libraryId",
    otherKey: "bookId",
    as: "books",
  })
  books!: Book[];
}

export default Library;

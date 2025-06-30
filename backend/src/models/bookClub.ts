import { MAX_CLUB_MEMBERS } from "../utils/constants.js";
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import ChatMessage from "./chatMessage.js";
import ClubMembers from "./clubMembers.js";

@Table({
  tableName: "book_clubs",
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ["name"],
    },
  ],
})
class BookClub extends Model<BookClub> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Unique
  @Index({ name: "unique_name", unique: true })
  @Column({
    type: DataType.STRING(100),
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  })
  name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(1000),
    validate: {
      notEmpty: true,
      len: [10, 1000],
    },
  })
  description!: string;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isInt: true,
      min: 0,
      max: MAX_CLUB_MEMBERS,
    },
  })
  memberCount!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  image!: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @HasMany(() => ChatMessage, {
    onDelete: "CASCADE",
  })
  chatMessages!: ChatMessage[];

  @HasMany(() => ClubMembers, {
    onDelete: "CASCADE",
  })
  clubMembers!: ClubMembers[];
}

export default BookClub;

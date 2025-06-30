import BookClub from "./bookClub.js";
import User from "./user.js";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "chat_messages",
  timestamps: true,
  underscored: true,
})
class ChatMessage extends Model<ChatMessage> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  message!: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User, {
    as: "sender",
  })
  sender!: User;

  @AllowNull(false)
  @ForeignKey(() => BookClub)
  @Column(DataType.INTEGER)
  clubId!: number;

  @BelongsTo(() => BookClub, {
    as: "club",
  })
  club!: BookClub;

  @AllowNull(false)
  @CreatedAt
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;
}

export default ChatMessage;

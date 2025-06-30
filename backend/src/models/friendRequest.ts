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
} from "sequelize-typescript";
import { FRIEND_REQUEST_STATUS } from "../utils/enums/friendRequestStatus.js";
import User from "./user.js";

@Table({
  tableName: "friend_requests",
  timestamps: true,
  underscored: true,
})
class FriendRequest extends Model<FriendRequest> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Index({ name: "unique_sender_receiver", unique: true })
  @Column({
    type: DataType.INTEGER,
    validate: {
      isInt: true,
      min: 1,
    },
  })
  senderId!: number;

  @BelongsTo(() => User, { as: "sender", foreignKey: "senderId" })
  sender!: User;

  @AllowNull(false)
  @Index({ name: "unique_sender_receiver", unique: true })
  @Column(DataType.INTEGER)
  receiverId!: number;

  @BelongsTo(() => User, { as: "receiver", foreignKey: "receiverId" })
  receiver!: User;

  @AllowNull(false)
  @Default(FRIEND_REQUEST_STATUS.PENDING)
  @Column(DataType.ENUM(...Object.values(FRIEND_REQUEST_STATUS)))
  status!: FRIEND_REQUEST_STATUS;

  @AllowNull(false)
  @CreatedAt
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;
}
export default FriendRequest;

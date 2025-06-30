import { DataTypes } from "sequelize";
import User from "./user.js";
import BookClub from "./bookClub.js";
import { CLUB_MEMBER_ROLE } from "../utils/enums/clubMember.js";
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "club_members",
  timestamps: true,
  underscored: true,
})
class ClubMembers extends Model<ClubMembers> {
  @AllowNull(false)
  @Default(CLUB_MEMBER_ROLE.MEMBER)
  @Column({
    type: DataTypes.ENUM(...Object.values(CLUB_MEMBER_ROLE)),
    validate: {
      isIn: [Object.values(CLUB_MEMBER_ROLE)],
    },
  })
  role!: CLUB_MEMBER_ROLE;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Index({ name: "club_members_user_club", unique: true })
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User, {
    as: "user",
  })
  user!: User;

  @AllowNull(false)
  @ForeignKey(() => BookClub)
  @Index({ name: "club_members_user_club", unique: true })
  @Column(DataType.INTEGER)
  clubId!: number;

  @BelongsTo(() => BookClub, {
    as: "club",
  })
  club!: BookClub;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default ClubMembers;

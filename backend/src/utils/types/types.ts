import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ROLES } from "../enums/roles";

export interface DecodedToken extends JwtPayload {
  id: number;
  email: string;
  role: ROLES;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: string;
  name: string;
  bio?: string | null;
  profileImage?: string | null;
  favoriteGenres?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LibraryAttributes {
  id: number;
  status: string;
  visibility: string;
  customListName?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface FriendRequestAttributes {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentReactionAttributes {
  id: number;
  reaction: string;
  userId: number;
  commentId: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentAttributes {
  id: number;
  likes: number;
  dislikes: number;
  comment: string;
  userId: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClubMembersAttributes {
  userId: number;
  clubId: number;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessageAttributes {
  id: number;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: number;
  bookClubId: number;
}

export interface BookRatingAttributes {
  id: number;
  rating: number;
  userId: number;
  bookId: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookClubAttributes {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  image?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

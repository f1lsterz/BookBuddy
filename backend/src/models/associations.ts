import Book from "./book.js";
import Comment from "./comment.js";
import BookClub from "./bookClub.js";
import BookRating from "./bookRating.js";
import ChatMessage from "./chatMessage.js";
import ClubMembers from "./clubMembers.js";
import CommentReaction from "./commentReaction.js";
import FriendRequest from "./friendRequest.js";
import Library from "./library.js";
import User from "./user.js";

export default function defineAssociations() {
  Book.hasMany(Comment, {
    foreignKey: "bookId",
    as: "comments",
  });

  Comment.belongsTo(Book, {
    foreignKey: "bookId",
    as: "book",
  });

  Book.belongsToMany(Library, {
    through: "LibraryBooks",
    foreignKey: "bookId",
    otherKey: "libraryId",
    as: "libraries",
  });

  Library.belongsToMany(Book, {
    through: "LibraryBooks",
    foreignKey: "libraryId",
    otherKey: "bookId",
    as: "books",
  });
}

BookRating.belongsTo(Book, { foreignKey: "bookId", as: "book" });
BookRating.belongsTo(User, { foreignKey: "userId", as: "user" });

Book.hasMany(BookRating, { foreignKey: "bookId", as: "ratings" });
User.hasMany(BookRating, { foreignKey: "userId", as: "ratings" });

ChatMessage.belongsTo(BookClub, {
  foreignKey: "clubId",
  as: "club",
});

ChatMessage.belongsTo(User, {
  foreignKey: "userId",
  as: "sender",
});

BookClub.hasMany(ChatMessage, {
  foreignKey: "clubId",
  as: "messages",
  onDelete: "CASCADE",
});

User.hasMany(ChatMessage, {
  foreignKey: "userId",
  as: "sentMessages",
});

BookClub.hasMany(ClubMembers, {
  foreignKey: "clubId",
  as: "clubMembers",
  onDelete: "CASCADE",
});
ClubMembers.belongsTo(BookClub, {
  foreignKey: "clubId",
  as: "club",
  onDelete: "CASCADE",
});

User.hasOne(ClubMembers, {
  foreignKey: "userId",
  as: "clubMembership",
  onDelete: "CASCADE",
});
ClubMembers.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
});

CommentReaction.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });
CommentReaction.belongsTo(User, { foreignKey: "userId", as: "user" });

Comment.hasMany(CommentReaction, { foreignKey: "commentId", as: "reactions" });
User.hasMany(CommentReaction, { foreignKey: "userId", as: "reactions" });

Library.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Library, {
  foreignKey: "userId",
  as: "libraries",
});

User.belongsToMany(User, {
  through: "UserFriends",
  as: "friends",
  foreignKey: "userId",
  otherKey: "friendId",
});

User.hasMany(FriendRequest, { foreignKey: "senderId", as: "sentRequests" });
User.hasMany(FriendRequest, {
  foreignKey: "receiverId",
  as: "receivedRequests",
});
FriendRequest.belongsTo(User, { foreignKey: "senderId", as: "sender" });
FriendRequest.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

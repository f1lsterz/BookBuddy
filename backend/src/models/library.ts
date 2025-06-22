import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import { LIBRARY_STATUS } from "../utils/enums/libraryStatus.js";
import { LIBRARY_VISIBILITY } from "../utils/enums/libraryVisibility.js";

const Library = sequelize.define(
  "Library",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: {
      type: DataTypes.ENUM(...Object.values(LIBRARY_STATUS)),
      allowNull: false,
      validate: {
        isIn: [Object.values(LIBRARY_STATUS)],
      },
    },
    visibility: {
      type: DataTypes.ENUM(...Object.values(LIBRARY_VISIBILITY)),
      allowNull: false,
      defaultValue: LIBRARY_VISIBILITY.PRIVATE,
      validate: {
        isIn: [Object.values(LIBRARY_VISIBILITY)],
      },
    },
    customListName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100],
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "libraries",
  }
);

export default Library;

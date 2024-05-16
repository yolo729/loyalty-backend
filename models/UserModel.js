import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import UserData from "./UserDataModel.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
    signOption: {
      type: DataTypes.STRING,
      field: "signOption",
    },
    google_id: {
      type: DataTypes.STRING,
      field: "google_id",
    },
    facebook_id: {
      type: DataTypes.STRING,
      field: "facebook_id",
    },
    apple_id: {
      type: DataTypes.STRING,
      field: "apple_id",
    },
    DeleteReason: {
      type: DataTypes.STRING,
      field: "DeleteReason",
    },
    zinreloToken: {
      type: DataTypes.STRING,
      field: "zinrelo_token",
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(UserData, { foreignKey: "user_id" });

export default Users;

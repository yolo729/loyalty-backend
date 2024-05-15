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

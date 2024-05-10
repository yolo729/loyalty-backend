import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const UserData = db.define(
  "user_data",
  {
    user_id: {
      type: DataTypes.STRING,
      references: {
        model: "Users",
        key: "id",
      },
    },
    birthday: {
      type: DataTypes.DATE,
    },
    phone: {
      type: DataTypes.TEXT,
    },
    country: {
      type: DataTypes.TEXT,
    },
    address1: {
      type: DataTypes.TEXT,
    },
    address2: {
      type: DataTypes.TEXT,
    },
    province: {
      type: DataTypes.TEXT,
    },
    postcode: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at", // This sets the column label as 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at", // This sets the column label as 'updated_at'
    },
  },
  {
    freezeTableName: true,
  }
);

let Users; // Declare the Users variable

// Import the Users model asynchronously
import("./UserModel.js").then((module) => {
  Users = module.default;
  UserData.belongsTo(Users, { foreignKey: "user_id", as: "user" });
});

export default UserData;

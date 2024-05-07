import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    // refresh_token: {
    //     type: DataTypes.TEXT
    // },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at' // This sets the column label as 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at' // This sets the column label as 'updated_at'
    },

}, {
    freezeTableName: true
});

export default Users;
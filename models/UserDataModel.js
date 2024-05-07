import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const UserData = db.define('user_data', {
    user_id: {
        type: DataTypes.STRING
    },
    birthday: {
        type: DataTypes.DATE
    },
    phone: {
        type: DataTypes.TEXT
    },
    country: {
        type: DataTypes.TEXT
    },
    address1: {
        type: DataTypes.TEXT
    },
    address2: {
        type: DataTypes.TEXT
    },
    province: {
        type: DataTypes.TEXT
    },
    postcode: {
        type: DataTypes.TEXT
    },
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

export default UserData;
import {Sequelize} from "sequelize";

const db = new Sequelize('loyalty','root','',{
    host: "localhost",
    dialect: "mysql"
});

export default db;
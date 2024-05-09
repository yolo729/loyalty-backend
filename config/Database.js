import { Sequelize } from "sequelize";

import { Sequelize } from "sequelize";
import "dotenv/config";

const DB_Name = process.env.DB_NAME;
const ROOT = process.env.ROOT;
const PWD = process.env.PASSWORD;
const HOST = process.env.HOST;

const db = new Sequelize(DB_Name, ROOT, PWD, {
  host: HOST,
  dialect: "mysql",
});

export default db;

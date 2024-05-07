import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";

const apiUrl = process.env.MY_DOMAIN;
const Port = process.env.PORT;
const ENV = process.env.ENV;


dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database Connected...');
} catch (error) {
    console.error(error);
}

app.use(cors({ credentials:true, origin: {apiUrl}, methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
    res.send("Running Server");
  });
  
app.listen(Port, ENV == "dev" ? "127.0.0.1" : "0.0.0.0", ()=> console.log('Server running at port 5000'));


  
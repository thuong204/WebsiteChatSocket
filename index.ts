import express, { Express, Request, Response } from 'express';
import clientRoutes from "./routes/client/index.route"
import flash from "express-flash"
import dotenv from "dotenv"
import session from "express-session"
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"
import mongoose from "mongoose";
import http from "http";
import * as database from "./config/database"
import { Server, Socket } from "socket.io";
import MongoStore from "connect-mongo";
import cors from"cors"
import { configurePassport, configureSession } from './config/passportConfig';
// import { configurePassport, configureSession } from './config/passportConfig';



dotenv.config()
const app: Express = express()

const port:number |string = process.env.PORT || 3000;

app.use(cookieParser("JHGJKLKLGFLJK"))

database.connect();
app.use(flash())

// socket 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*", // Thay đổi URL này
      methods: ["GET", "POST"]
  }
});

global._io = io;

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(`${__dirname}/public`))
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug")

configureSession(app);
configurePassport(app);

clientRoutes(app)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
export default app;

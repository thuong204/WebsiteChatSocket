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



dotenv.config()
const app: Express = express()

const port = process.env.PORT || 3000

app.use(cookieParser("JHGJKLKLGFLJK"))
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false, 
    saveUninitialized: false,
    cookie: {
      maxAge: 60000, 
      secure: process.env.NODE_ENV === 'production',
    },
  })
);
database.connect();
app.use(flash())

// socket 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*", // Cho phép mọi nguồn truy cập
      methods: ["GET", "POST"]
  }
});
export const _io = io;



app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(`${__dirname}/public`))
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug")
clientRoutes(app)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

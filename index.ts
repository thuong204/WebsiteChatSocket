import express, {Express,Request, Response } from 'express';
import clientRoutes from "./routes/client/index.route"
import flash from "express-flash"
import dotenv from "dotenv"
import session from "express-session"
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import * as database from "./config/database"


dotenv.config()
const app:Express = express()


const port = process.env.PORT || 3000
app.use(
    session({
      secret: "thuong",
      resave: false,
      saveUninitialized: true,
    })
  );
database.connect();
app.use(flash())



app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(`${__dirname}/public`))
app.set("views",`${__dirname}/views`);
app.set("view engine","pug")
clientRoutes(app)

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})

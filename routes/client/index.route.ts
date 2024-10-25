import { Express } from "express";
import {chatRoutes}  from "./chat.route"
import { userRoutes } from "./user.route";

const clientRoutes = (app:Express) =>{
    app.use(`/`,chatRoutes)
    app.use("/user",userRoutes)


}
export default clientRoutes
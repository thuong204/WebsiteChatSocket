import { Express } from "express";
import {chatRoutes}  from "./chat.route"
import { userRoutes } from "./user.route";
import * as authUser  from "../../middlewares/clients/auth.middleware";
import * as infoUser  from "../../middlewares/clients/user.middleware";
import { friendRoutes } from "./friend.route";

const clientRoutes = (app:Express) =>{
    app.use(`/chat`,authUser.authUser,infoUser.infoUser,chatRoutes)
    app.use("/user",userRoutes)
    app.use("/friends",authUser.authUser,infoUser.infoUser,friendRoutes)
}
export default clientRoutes
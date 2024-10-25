import { Express } from "express";
import {chatRoutes}  from "./chat.route"

const clientRoutes = (app:Express) =>{
    app.use(`/`,chatRoutes)


}
export default clientRoutes
import { Express } from "express";
import {homeRoutes}  from "./home.route"

const clientRoutes = (app:Express) =>{
    app.use(`/`,homeRoutes)


}
export default clientRoutes
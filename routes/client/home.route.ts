import { Router } from "express";
import * as  homeController from "../../controller/client/home.controller"
const router:Router = Router()
router.get("/",homeController.index)
export const homeRoutes:Router = router

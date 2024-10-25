import { Router } from "express";
import * as  chatController from "../../controller/client/chat.controller"
const router:Router = Router()
router.get("/chat",chatController.index)
export const chatRoutes:Router = router

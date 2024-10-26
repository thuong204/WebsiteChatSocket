import { Router } from "express";
import * as  chatController from "../../controller/client/chat.controller"
const router:Router = Router()

router.get("/",chatController.index)
router.get("/receiver/:receiverId",chatController.fetchMessage)
router.get("/:roomId",chatController.roomMessage)

export const chatRoutes:Router = router

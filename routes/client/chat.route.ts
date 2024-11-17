import { Router } from "express";
import * as  chatController from "../../controller/client/chat.controller"
const router:Router = Router()

router.get("/",chatController.index)
router.get("/receiver/:receiverId",chatController.fetchMessage)
router.get("/:roomId",chatController.roomMessage)
router.get("/video/:userId",chatController.videoCall)

export const chatRoutes:Router = router

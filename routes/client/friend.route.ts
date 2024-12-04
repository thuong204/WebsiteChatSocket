import  {Router} from "express"
import * as friendController  from "../../controller/client/friend.controller"

const router:Router = Router()

router.get("/",friendController.index)
router.get("/suggestions",friendController.suggestion)
router.get("/send",friendController.send)
router.get("/accept",friendController.accept)
router.get("/find",friendController.find)
router.get("/search-api",friendController.searchApi)

export const friendRoutes: Router =  router


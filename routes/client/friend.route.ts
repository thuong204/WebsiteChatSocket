import  {Router} from "express"
import * as friendController  from "../../controller/client/friend.controller"

const router:Router = Router()

router.get("/",friendController.index)
router.get("/suggestions",friendController.suggestion)

export const friendRoutes: Router =  router


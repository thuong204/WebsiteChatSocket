import { Router } from "express";
import * as userController from "../../controller/client/user.controller"
import *as validateUser from "../../validate/validate-user"

const router:Router= Router()
router.get("/login",userController.login)
router.get("/register",userController.register)
router.post("/login",validateUser.validateLogin,userController.loginPost)
router.post("/register",validateUser.validateRegister,userController.registerPost)
router.get("/register/otp/",userController.verifyotp)
export const userRoutes:Router  =router
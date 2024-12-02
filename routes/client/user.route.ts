import { Router } from "express";
import * as userController from "../../controller/client/user.controller"
import *as validateUser from "../../validate/validate-user"

const router:Router= Router()
router.get("/login",userController.login)
router.get("/register",userController.register)
router.post("/login",validateUser.validateLogin,userController.loginPost)
router.post("/register",validateUser.validateRegister,userController.registerPost)
router.get("/register/otp/",userController.verifyotp)
router.get("/logout",userController.logout)
router.get("/password/forgot", userController.forgotPassword)
router.post("/password/forgot",userController.forgotPasswordPost)
router.get("/password/otp",userController.otpPassword)
router.post("/password/otp",userController.otpPasswordPost)
router.get("/password/reset",userController.resetPassword)
router.post("/password/reset",userController.resetPasswordPost)
export const userRoutes:Router  =router
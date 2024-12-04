import { Router } from "express";
import * as userController from "../../controller/client/user.controller"
import *as validateUser from "../../validate/validate-user"
import {setupFacebookStrategy,setupGoogleStrategy} from "../../helpers/passportHelper"

import passport from "passport"

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
router.get("/login/federated/google",passport.authenticate('google'))
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: '/login'
  }),userController.loginSuccessGoogle);
router.get('/login/federated/facebook', passport.authenticate('facebook'));

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  failureRedirect: '/login',

}),userController.loginSuccessFacebook);



setupGoogleStrategy()
setupFacebookStrategy()

router.post("/update-status",userController.updateStatus)



export const userRoutes:Router  =router
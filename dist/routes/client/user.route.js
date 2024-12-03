"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController = __importStar(require("../../controller/client/user.controller"));
const validateUser = __importStar(require("../../validate/validate-user"));
const passportHelper_1 = require("../../helpers/passportHelper");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get("/login", userController.login);
router.get("/register", userController.register);
router.post("/login", validateUser.validateLogin, userController.loginPost);
router.post("/register", validateUser.validateRegister, userController.registerPost);
router.get("/register/otp/", userController.verifyotp);
router.get("/logout", userController.logout);
router.get("/password/forgot", userController.forgotPassword);
router.post("/password/forgot", userController.forgotPasswordPost);
router.get("/password/otp", userController.otpPassword);
router.post("/password/otp", userController.otpPasswordPost);
router.get("/password/reset", userController.resetPassword);
router.post("/password/reset", userController.resetPasswordPost);
router.get("/login/federated/google", passport_1.default.authenticate('google'));
router.get('/oauth2/redirect/google', passport_1.default.authenticate('google', {
    failureRedirect: '/login'
}), userController.loginSuccessGoogle);
router.get('/login/federated/facebook', passport_1.default.authenticate('facebook'));
router.get('/oauth2/redirect/facebook', passport_1.default.authenticate('facebook', {
    failureRedirect: '/login',
}), userController.loginSuccessFacebook);
(0, passportHelper_1.setupGoogleStrategy)();
(0, passportHelper_1.setupFacebookStrategy)();
exports.userRoutes = router;

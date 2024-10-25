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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.resetPassword = exports.validateRegister = void 0;
const validateEmail = __importStar(require("./validate-email"));
const validatePassword = __importStar(require("./validate-password"));
const validatePhoneNumber = __importStar(require("./validate-phone"));
const validateRegister = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("Error", "Vui lòng nhập họ tên");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("Error", "Vui lòng nhập email");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("Error", "Vui lòng nhập mật khẩu");
        res.redirect("back");
        return;
    }
    if (!validateEmail.validateEmail(req.body.email)) {
        req.flash("Error", "Email không hợp lệ");
        res.redirect("back");
        return;
    }
    if (!validatePassword.validatePassword(req.body.password)) {
        req.flash("Error", "Mật khẩu không hợp lệ");
        res.redirect("back");
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        req.flash("Error", "Mật khẩu phải giống xác nhận mật khẩu");
        res.redirect("back");
        return;
    }
    if (!validatePhoneNumber.validatePhoneNumber(req.body.phone)) {
        req.flash("Error", "Số điện thoại không hợp lệ");
        res.redirect("back");
        return;
    }
    next();
};
exports.validateRegister = validateRegister;
const resetPassword = (req, res, next) => {
    if (!req.body.password) {
        req.flash("Error", "Mật khẩu không được để trống");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmpassword) {
        req.flash("Error", "Vui lòng nhập xác nhận mật khẩu");
        res.redirect("back");
        return;
    }
    if (!validatePassword.validatePassword(req.body.password)) {
        req.flash("Error", "Mật khẩu quá dễ");
        res.redirect("back");
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        req.flash("Error", "Xác nhận mật khẩu phải giống với mật khẩu");
        res.redirect("back");
        return;
    }
    next();
};
exports.resetPassword = resetPassword;
const validateLogin = (req, res, next) => {
    if (!req.body.phone) {
        req.flash("Error", "Vui lòng nhập số điện thoại");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("Error", "Vui lòng nhập mật khẩu");
        res.redirect("back");
        return;
    }
    if (!validatePhoneNumber.validatePhoneNumber(req.body.phone)) {
        req.flash("Error", "Số điện thoại không hợp lệ");
        res.redirect("back");
        return;
    }
    if (!validatePassword.validatePassword(req.body.password)) {
        req.flash("Error", "Email không hợp lệ");
        res.redirect("back");
        return;
    }
    next();
};
exports.validateLogin = validateLogin;

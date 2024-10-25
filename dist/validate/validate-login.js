"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const validate_email_1 = require("./validate-email");
const validate_password_1 = require("./validate-password");
const validateLogin = (req, res, next) => {
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
    if (!(0, validate_email_1.validateEmail)(req.body.email)) {
        req.flash("Error", "Email không hợp lệ");
        res.redirect("back");
        return;
    }
    if (!(0, validate_password_1.validatePassword)(req.body.password)) {
        req.flash("Error", "Email không hợp lệ");
        res.redirect("back");
        return;
    }
    next();
};
exports.validateLogin = validateLogin;

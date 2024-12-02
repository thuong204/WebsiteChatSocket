"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordPost = exports.resetPassword = exports.otpPasswordPost = exports.otpPassword = exports.forgotPasswordPost = exports.forgotPassword = exports.logout = exports.verifyotp = exports.registerPost = exports.loginPost = exports.register = exports.login = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
const generate_1 = require("../../helpers/generate");
const sendmail_1 = require("../../helpers/sendmail");
const forgotpassword_model_1 = __importDefault(require("../../model/forgotpassword.model"));
const login = (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    });
};
exports.login = login;
const register = (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kis"
    });
};
exports.register = register;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existPhoneNumber = yield user_model_1.default.findOne({
        phone: req.body.phone,
        deleted: false
    });
    if (!existPhoneNumber) {
        req.flash("Error", "Số điệnt thoại không chính xác");
        res.redirect("back");
    }
    else {
        const user = yield user_model_1.default.findOne({
            phone: req.body.phone,
            password: req.body.password
        });
        if (user) {
            if (user.status == "inactive") {
                req.flash("Tài khoản đã bị khóa");
            }
            else {
                res.cookie("tokenUser", user.tokenUser);
                yield user.updateOne({
                    statusOnline: "online"
                });
                global._io.once("connection", (socket) => {
                    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
                });
                res.redirect("/chat");
            }
        }
        else {
            req.flash("Error", "Mật khẩu không chính xác");
            res.redirect("back");
        }
    }
});
exports.loginPost = loginPost;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield user_model_1.default.findOne({
        deleted: false,
        email: req.body.email
    });
    const existPhoneNumber = yield user_model_1.default.findOne({
        deleted: false,
        phone: req.body.phone
    });
    if (existEmail) {
        req.flash("Error", "Email đẫ tồn tại! Vui lòng chọn một email khác");
        res.redirect("back");
    }
    else if (existPhoneNumber) {
        req.flash("Error", "Số điện thoại đẫ tồn tại! Vui lòng chọn một số điện thoại khác");
        res.redirect("back");
    }
    else {
        const user = new user_model_1.default(req.body);
        yield user.save();
        req.flash("Success", "Đăng kí tài khoản Chat thành công. Vui lòng đăng nhập để dùng dịch vụ.");
        res.render("client/pages/user/login", {
            pageTitle: "Đăng nhập"
        });
    }
});
exports.registerPost = registerPost;
const verifyotp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/verifyotp", {
        pageTitle: "Xác thực OTP"
    });
});
exports.verifyotp = verifyotp;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/forgotpassword", {
        pageTitle: "Quên mật khẩu"
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("Error", "Email không tồn tại. Vui lòng thử lại.");
        res.redirect("back");
        return;
    }
    const objectForgotPassword = {
        email: email,
        otp: "",
        expireAt: Date.now()
    };
    objectForgotPassword.otp = (0, generate_1.generateRandomNumber)(4);
    const forgotPassword = new forgotpassword_model_1.default(objectForgotPassword);
    yield forgotPassword.save();
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `
        Mã OTP xác minh lấy lại mật khẩu là <b> ${objectForgotPassword.otp} </b>. Lưu ý không để lộ mã OTP. Thời hạn sử dụng mã là 3 phút
    `;
    (0, sendmail_1.sendMail)(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
});
exports.forgotPasswordPost = forgotPasswordPost;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/otp", {
        pageTitle: "Nhập OTP",
        email: req.query.email
    });
});
exports.otpPassword = otpPassword;
const otpPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = req.body.otp;
    const email = req.body.email;
    const otpPassword = yield forgotpassword_model_1.default.findOne({
        otp: otp,
        email: email
    });
    if (!otpPassword) {
        req.flash("Error", "Mã OTP không chính xác hoặc đã hét hạn. Vui lòng thử lại.");
        res.redirect("back");
    }
    const user = yield user_model_1.default.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
});
exports.otpPasswordPost = otpPasswordPost;
const resetPassword = (req, res) => {
    res.render("client/pages/user/changepassword");
};
exports.resetPassword = resetPassword;
const resetPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    yield user_model_1.default.updateOne({
        tokenUser: req.cookies.tokenUser
    }, {
        password: password
    });
    req.flash("Success", "Thay đổi mật khẩu thành công");
    res.redirect("/chat");
});
exports.resetPasswordPost = resetPasswordPost;

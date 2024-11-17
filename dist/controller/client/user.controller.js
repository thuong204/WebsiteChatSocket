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
exports.verifyotp = exports.registerPost = exports.loginPost = exports.register = exports.login = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
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

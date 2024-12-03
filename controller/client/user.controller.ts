import { Request, Response } from "express"
import User from "../../model/user.model"
import IUser from "../../model/user.model"
import { generateRandomNumber, generateRandomString } from "../../helpers/generate"
import { sendOTP, verifyOTP } from '../../helpers/otp';
import { sendMail } from "../../helpers/sendmail"
import ForgotPassword from "../../model/forgotpassword.model";
export const login = async (req: Request, res: Response) => {

    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        })
        res.redirect("/user/chat")
    }
    else {
        res.render("client/pages/user/login", {
            pageTitle: "Đăng nhập"
        })

    }

}
export const register = (req: Request, res: Response) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí"
    })

}
export const loginPost = async (req: Request, res: Response) => {
    const existPhoneNumber = await User.findOne({
        phone: req.body.phone,
        deleted: false
    })
    if (!existPhoneNumber) {
        req.flash("Error", "Số điệnt thoại không chính xác")
        res.redirect("back")
    }
    else {
        const user = await User.findOne({
            phone: req.body.phone,
            password: req.body.password
        })

        if (user) {
            if (user.status == "inactive") {
                req.flash("Tài khoản đã bị khóa")
            }
            else {
                res.cookie("tokenUser", user.tokenUser)
                await user.updateOne({
                    statusOnline: "online"
                })
                global._io.once("connection", (socket) => {
                    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id)
                })
                res.redirect("/chat")
            }
        }
        else {
            req.flash("Error", "Mật khẩu không chính xác")
            res.redirect("back")
        }
    }


}
export const registerPost = async (req: Request, res: Response) => {

    const existEmail = await User.findOne({
        deleted: false,
        email: req.body.email
    })
    const existPhoneNumber = await User.findOne({
        deleted: false,
        phone: req.body.phone
    })
    if (existEmail) {
        req.flash("Error", "Email đẫ tồn tại! Vui lòng chọn một email khác")
        res.redirect("back")
    }
    else if (existPhoneNumber) {
        req.flash("Error", "Số điện thoại đẫ tồn tại! Vui lòng chọn một số điện thoại khác")
        res.redirect("back")
    } else {

        const user = new User(req.body)
        await user.save()
        req.flash("Success", "Đăng kí tài khoản Chat thành công. Vui lòng đăng nhập để dùng dịch vụ."
        )
        res.render("client/pages/user/login", {
            pageTitle: "Đăng nhập"
        })

    }
}
export const verifyotp = async (req: Request, res: Response) => {

    res.render("client/pages/user/verifyotp", {
        pageTitle: "Xác thực OTP"
    })
}
export const logout = async (req: Request, res: Response) => {

    const tokenUser = req.cookies.tokenUser
    await User.updateOne({
        tokenUser:tokenUser
    },{
        statusOnline:"offine",
        lastOnline: new Date()
    })
    res.clearCookie("tokenUser")
    res.redirect("/user/login")
}

export const forgotPassword = async (req: Request, res: Response) => {
    res.render("client/pages/user/forgotpassword", {
        pageTitle: "Quên mật khẩu"
    })
}

export const forgotPasswordPost = async (req: Request, res: Response) => {
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("Error", "Email không tồn tại. Vui lòng thử lại.")
        res.redirect("back")
        return;
    }
    const objectForgotPassword = {
        email: email,
        otp: "",
        expireAt: Date.now()
    }
    objectForgotPassword.otp = generateRandomNumber(4)
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    //send email
    const subject = `Mã OTP xác minh lấy lại mật khẩu`
    const html = `
        Mã OTP xác minh lấy lại mật khẩu là <b> ${objectForgotPassword.otp} </b>. Lưu ý không để lộ mã OTP. Thời hạn sử dụng mã là 3 phút
    `

    sendMail(email, subject, html)
    res.redirect(`/user/password/otp?email=${email}`)
}

export const otpPassword = async (req: Request, res: Response) => {
    res.render("client/pages/user/otp", {
        pageTitle: "Nhập OTP",
        email: req.query.email
    })
}
export const otpPasswordPost = async (req: Request, res: Response) => {
    const otp = req.body.otp;
    const email = req.body.email
    const otpPassword = await ForgotPassword.findOne({
        otp: otp,
        email: email
    })
    if (!otpPassword) {
        req.flash("Error", "Mã OTP không chính xác hoặc đã hét hạn. Vui lòng thử lại.")

        res.redirect("back")
    }
    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/user/password/reset")
}
export const resetPassword = (req: Request, res: Response) => {
    res.render("client/pages/user/changepassword")
}
export const resetPasswordPost = async (req: Request, res: Response) => {
    const password = req.body.password
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    }, {
        password: password
    })
    req.flash("Success", "Thay đổi mật khẩu thành công")
    res.redirect("/chat")
}



interface IUser {
    id: string;
    googleId: string;
    email: string;
    name: string;
    tokenUser: string;
    status: string
}


export const loginSuccessGoogle = async (req: Request, res: Response) => {

    if (req.user) {
        const user = req.user as IUser

        if (user.status === "inactive") {
            req.flash("error", "Tài khoản đã bị khóa");
        } else {
            res.cookie("tokenUser", user.tokenUser);
            res.redirect("/chat");
        }
    } else {
        res.redirect("/user/login");
    }
};

export const loginSuccessFacebook = async (req: Request, res: Response) => {
    if (req.user) {
        const user = req.user as IUser
        if (user.status === "inactive") {
            req.flash("error", "Tài khoản đã bị khóa");
        } else {
            res.cookie("tokenUser", user.tokenUser);
            res.redirect("/");
        }
    } else {
        res.redirect("/user/login");
    }
};
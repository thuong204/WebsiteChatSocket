import { Request, Response } from "express"
import User from "../../model/user.model"
import { sendOTP, verifyOTP } from '../../helpers/otp';
export const login = (req: Request, res: Response) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    })

}
export const register = (req: Request, res: Response) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kis"
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
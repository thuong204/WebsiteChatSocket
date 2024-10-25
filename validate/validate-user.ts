import { NextFunction } from "express"
import { Request,Response } from "express"
import * as validateEmail from "./validate-email"
import *as validatePassword from "./validate-password"
import * as validatePhoneNumber  from "./validate-phone"
export const validateRegister = (req:Request,res:Response,next:NextFunction) =>{
    if(!req.body.fullName){
        req.flash("Error","Vui lòng nhập họ tên")
        res.redirect("back")
        return 
    }
    if(!req.body.email){
        req.flash("Error","Vui lòng nhập email")
        res.redirect("back")
        return 
    }
    if(!req.body.password){
        req.flash("Error","Vui lòng nhập mật khẩu")
        res.redirect("back")
        return 
    }
    if(!validateEmail.validateEmail(req.body.email)){
        req.flash("Error","Email không hợp lệ")
        res.redirect("back")
        return 
    }if(!validatePassword.validatePassword(req.body.password)){
        req.flash("Error","Mật khẩu không hợp lệ")
        res.redirect("back")
        return 
    }
    if(req.body.password != req.body.confirmPassword){
        req.flash("Error","Mật khẩu phải giống xác nhận mật khẩu")
        res.redirect("back")
        return
    }
    if(!validatePhoneNumber.validatePhoneNumber(req.body.phone)){
        req.flash("Error","Số điện thoại không hợp lệ")
        res.redirect("back")
        return 
    }
    next()

}
export const resetPassword = (req:Request,res:Response,next:NextFunction) =>{
    if(!req.body.password){
        req.flash("Error","Mật khẩu không được để trống")
        res.redirect("back")
        return
    }
    if(!req.body.confirmpassword){
        req.flash("Error","Vui lòng nhập xác nhận mật khẩu")
        res.redirect("back")
        return
    }
    if(!validatePassword.validatePassword(req.body.password)){
        req.flash("Error","Mật khẩu quá dễ")
        res.redirect("back")
        return 
    }
    if(req.body.password != req.body.confirmPassword){
        req.flash("Error","Xác nhận mật khẩu phải giống với mật khẩu")
        res.redirect("back")
        return
    }
    next()

}
export const validateLogin = (req:Request,res:Response,next:NextFunction) =>{
    if(!req.body.phone){
        req.flash("Error","Vui lòng nhập số điện thoại")
        res.redirect("back")
        return 
    }
    if(!req.body.password){
        req.flash("Error","Vui lòng nhập mật khẩu")
        res.redirect("back")
        return 
    }
    if(!validatePhoneNumber.validatePhoneNumber(req.body.phone)){
        req.flash("Error","Số điện thoại không hợp lệ")
        res.redirect("back")
        return 
    }
    if(!validatePassword.validatePassword(req.body.password)){
        req.flash("Error","Email không hợp lệ")
        res.redirect("back")
        return 
    }
    next()

}
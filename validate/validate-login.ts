import { NextFunction } from "express"
import { Request,Response } from "express"
import {validateEmail} from "./validate-email"
import {validatePassword} from "./validate-password"
export const validateLogin = (req:Request,res:Response,next:NextFunction) =>{
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
    if(!validateEmail(req.body.email)){
        req.flash("Error","Email không hợp lệ")
        res.redirect("back")
        return 
    }
    if(!validatePassword(req.body.password)){
        req.flash("Error","Email không hợp lệ")
        res.redirect("back")
        return 
    }
    next()

}
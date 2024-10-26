import { NextFunction,Request,Response } from "express"
import User from "../../model/user.model"
export const authUser = async(req:Request,res:Response,next:NextFunction) =>{
    if(!req.cookies.tokenUser){
        return res.redirect("/user/login")
    }
    else{
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        })
        if(!user){
            res.redirect("/user/login")
        } 
        next() 
      
    } 
    
}
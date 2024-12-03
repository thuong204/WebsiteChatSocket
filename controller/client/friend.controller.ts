import { Request,Response } from "express";
import User from "../../model/user.model";

export const index = (req:Request,res:Response) =>{

    
    res.render("client/pages/friend/index",{
        pageTitle: "Bạn bè"
    })

}
export const suggestion = async (req:Request,res:Response) =>{

    const listUsers = await User.find({
        _id:{ $ne: res.locals.user.id},
        deleted: false,
        status: "active"
    })
    .limit(20)  
    .sort({ lastOnline: -1 })  
    .select("fullName avatar id");  
    
    res.render("client/pages/friend/suggestion",{
        pageTitle: "Gợi ý kết bạn",
        listUsers: listUsers
    })
} 
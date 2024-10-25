import { Request,Response } from "express"
export const index = (req:Request,res:Response) =>{
    res.render("client/pages/chat/index.pug")
}
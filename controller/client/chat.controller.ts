import { Request, Response } from "express"
import { Server } from "socket.io"
import Room from "../../model/room.model"
import Message from "../../model/message.model"
import { _io } from "../../index"
import * as chatSocket from "../../socket/chat"
import User from "../../model/user.model"

// let _io:Server
export const index = async (req: Request, res: Response) => {


    chatSocket.chatSocket(res)
    const users = await User.find({
        deleted: false,
        status: "active",
        _id: { $ne: res.locals.user.id } // Loại trừ người dùng có ID là res.locals.user.id
    });
    


    res.render("client/pages/chat/index.pug", {
        pageTitle: "Trang chat",
        users: users
    })
}
export const fetchMessage = async (req: Request, res: Response) => {
    const userId = res.locals.user.id
    const receiverId = req.params.receiverId
    const idsToSearch = [userId, receiverId];
    const room = await Room.findOne({
        user_id: { $all: idsToSearch }
    })
    if (room) {
        const message = await Message.find({
            room_id: room.id
        })
        res.json({
            "code": 200,
            "data": message
        })
    } else {
        res.json({
            "code": 200,
            "data": "null"
        })
    }

}
export const roomMessage = async (req: Request, res: Response) => {
    chatSocket.chatSocket(res)
    const users = await User.find({
        deleted: false,
        status: "active",
        _id: { $ne: res.locals.user.id } // Loại trừ người dùng có ID là res.locals.user.id
    });
    const messages = await Message.find({
        room_id: req.params.roomId
    })
    

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Trang chat",
        users: users,
        messages:messages
    })
}
import { Request, Response } from "express"
import { Server } from "socket.io"
import Room from "../../model/room.model"
import Message from "../../model/message.model"
import * as chatSocket from "../../socket/chat"
import User from "../../model/user.model"
import { timeStamp } from "console"
import { getLastOnlineTime } from "../../helpers/getLastOnline"

export const index = async (req: Request, res: Response) => {

    const rooms = await Room.find({
        deleted: false,
        user_id: res.locals.user.id
    });
    let userIds = [];
    for (const room of rooms) {
        userIds = userIds.concat(room.user_id);
    }
    userIds = userIds.filter(id => id !== res.locals.user.id);

    const listUsers = await User.find({
        deleted: false,
        status: "active",
        _id: { $in: userIds }
    });



    res.render("client/pages/chat/chathello.pug", {
        pageTitle: "Trang chủ",
        listUsers: listUsers
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
        const messages = await Message.find({
            room_id: room.id
        }).select("sender content room_id images files").limit(20).sort({
            createdAt: "desc"
        })
        messages.reverse();
        const filteredUserIds = room.user_id.filter(userId => userId !== res.locals.user.id);

        const user = await User.findOne({
            deleted: false,
            status: "active",
            _id: filteredUserIds // Loại trừ người dùng có ID là res.locals.user.id
        }).select("id fullName avatar lastOnline statusOnline");

        const lastOnline = getLastOnlineTime(user.lastOnline)
        user["lastOnlineTime"] = lastOnline;

        // Tìm 20 tin nhắn gần nhất có chứa hình ảnh trong phòng
        const listMessagesWithImages = await Message.find({
            room_id: room.id,
            images: { $exists: true, $not: { $size: 0 } }, // Chỉ lấy các tin nhắn có ít nhất 1 hình ảnh
            deleted: false // Loại bỏ các tin nhắn đã bị xóa
        })
            .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian
            .limit(10).select("images"); // Lấy 20 tin nhắn

        res.json({
            "code": 200,
            "data": {
                messages: messages,
                infoReceiver: user,
                roomId: room.id,
                listImages: listMessagesWithImages
            }
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

    const userInRoom = await Room.findOne({
        deleted: false,
        _id: req.params.roomId
    }).select("user_id")
    const filteredUserIds = userInRoom.user_id.filter(userId => userId !== res.locals.user.id);

    const user = await User.findOne({
        deleted: false,
        status: "active",
        _id: filteredUserIds // Loại trừ người dùng có ID là res.locals.user.id
    }).select("fullName avatar statusOnline lastOnline");
    const rooms = await Room.find({
        deleted: false,
        user_id: res.locals.user.id
    });
    let userIds = [];
    for (const room of rooms) {
        userIds = userIds.concat(room.user_id);
    }
    userIds = userIds.filter(id => id !== res.locals.user.id);

    const listUsers = await User.find({
        deleted: false,
        status: "active",
        _id: { $in: userIds }
    });

    const messages = await Message.find({
        room_id: req.params.roomId
    }).limit(20).sort({
        createdAt: "desc"
    })
    messages.reverse();

    const lastOnline = getLastOnlineTime(user.lastOnline)
    user["lastOnlineTime"] = lastOnline;


    //lấy ra image
    // Tìm 20 tin nhắn gần nhất có chứa hình ảnh trong phòng
    const listMessagesWithImages = await Message.find({
        room_id: req.params.roomId,
        images: { $exists: true, $not: { $size: 0 } }, // Chỉ lấy các tin nhắn có ít nhất 1 hình ảnh
        deleted: false // Loại bỏ các tin nhắn đã bị xóa
    })
        .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian
        .limit(20).select("images"); // Lấy 20 tin nhắn

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Trang chat",
        messages: messages,
        userreceive: user,
        room: userInRoom,
        listUsers: listUsers,
        listImages: listMessagesWithImages
    })
}
export const videoCall = async (req: Request, res: Response) => {
    const userId = req.params.userId
    const objectCall = {
        caller: res.locals.user.id,
        callee: userId
    }

    res.render("client/pages/chat/call.pug", {
        objectCall: objectCall
    })
}
import { Request, Response } from "express"
import { Server } from "socket.io"
import Room from "../../model/room.model"
import Message from "../../model/message.model"
import * as chatSocket from "../../socket/chat"
import User from "../../model/user.model"
import { timeStamp } from "console"
import moment from "moment"
import { getLastOnlineTime } from "../../helpers/getLastOnline"
import * as callSocket from "../../socket/call"
import 'moment/locale/vi'; // Import locale tiếng Việt
moment.locale('vi');


export const index = async (req: Request, res: Response) => {
    try {

        chatSocket.chatSocket(res);

        // Lấy danh sách phòng của người dùng hiện tại
        const rooms = await Room.find({
            deleted: false,
            user_id: res.locals.user.id
        });

        // Lấy danh sách userId từ các phòng (trừ user hiện tại)
        let userIds = [];
        rooms.forEach(room => {
            userIds.push(...room.user_id);
        });
        userIds = userIds.filter(id => id !== res.locals.user.id);

        // Lấy danh sách người dùng
        const listUsers = await User.find({
            deleted: false,
            status: "active",
            _id: { $in: userIds }
        }).select("fullName avatar statusOnline");

        // Lấy danh sách người dùng đã lọc
        const userMessages = await Promise.all(
            listUsers.map(async (user) => {

                //lấy phòng chứa 2 ng
                const room = await Room.findOne({
                    user_id: { $all: [user._id, res.locals.user.id] },
                    deleted: false
                });


                // Tìm phòng liên quan đến người dùng và gán room_id
                const specificRoom = rooms.find(room => {
                    const members = room.user_id.map(id => id.toString());
                    return (
                        members.includes(user._id.toString()) &&
                        members.includes(res.locals.user.id.toString()) &&
                        members.length === 2 // Phòng chỉ chứa đúng 2 người
                    );
                });
                // Lấy tin nhắn mới nhất
                const latestMessage = await Message.findOne({
                    room_id: room._id  // Lọc theo phòng
                })
                    .sort({ createdAt: -1 })
                    .limit(1).select("content images files createdAt room_id")
                if (!latestMessage) return {
                    user,
                    room_id: specificRoom ? specificRoom._id : null
                }

                // Kiểm tra loại tin nhắn và thay thế nội dung nếu là file hoặc hình ảnh
                let messageContent = latestMessage ? latestMessage.content : null;
                if (latestMessage) {
                    if (latestMessage.sender == res.locals.user.id) {
                        if (latestMessage.images && latestMessage.images.length > 0) {
                            messageContent = "Bạn: Đã gửi một hình ảnh";
                        } else if (latestMessage.files && latestMessage.files.length > 0) {
                            messageContent = "Bạn: Đã gửi một file";
                        } else {
                            messageContent = `Bạn: ${latestMessage.content}`
                        }
                    } else {
                        if (latestMessage.images && latestMessage.images.length > 0) {
                            messageContent = "Đã gửi một hình ảnh";
                        } else if (latestMessage.files && latestMessage.files.length > 0) {
                            messageContent = "Đã gửi một file";
                        } else {
                            messageContent = `${latestMessage.content}`
                        }
                    }
                }

                // Định dạng thời gian của tin nhắn
                const messageTime = latestMessage ? moment(latestMessage.createdAt) : null;

                // Nếu có thời gian tin nhắn
                const formattedMessageTime = messageTime
                    ? moment(messageTime).fromNow()
                    : "Chưa có tin nhắn";

                return {
                    user,
                    latestMessage: {
                        ...latestMessage.toObject(),
                        content: messageContent,
                        formattedMessageTime: formattedMessageTime,
                    },
                    room_id: specificRoom ? specificRoom._id : null
                };
            })
        );

        // Render trang Pug với danh sách người dùng đã được cải thiện
        res.render("client/pages/chat/chathello.pug", {
            pageTitle: "Trang chủ",

            listUsers: userMessages,
        });
    } catch (error) {
        console.error("Error loading chat data:", error);
        res.status(500).send("Server Error");
    }
};

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
            images: { $exists: true, $not: { $size: 0 } },
            deleted: false
        })
            .sort({ createdAt: -1 })
            .limit(10).select("images");


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
    // Kết nối socket chat
    chatSocket.chatSocket(res);

    // Lấy phòng và các người dùng trong phòng
    const userInRoom = await Room.findOne({
        deleted: false,
        _id: req.params.roomId
    }).select("user_id");

    // Lọc ID của người dùng trong phòng, loại trừ người dùng hiện tại
    const filteredUserIds = userInRoom.user_id.filter(userId => userId !== res.locals.user.id);

    // Lấy thông tin người dùng trong phòng
    const user = await User.findOne({
        deleted: false,
        status: "active",
        _id: filteredUserIds // Loại trừ người dùng hiện tại
    }).select("fullName avatar statusOnline lastOnline");

    // Lấy danh sách các phòng của người dùng hiện tại
    const rooms = await Room.find({
        deleted: false,
        user_id: res.locals.user.id
    });

    let userIds = [];
    for (const room of rooms) {
        userIds = userIds.concat(room.user_id);
    }

    // Loại trừ người dùng hiện tại
    userIds = userIds.filter(id => id !== res.locals.user.id);

    // Lấy danh sách tất cả người dùng liên quan
    const listUsers = await User.find({
        deleted: false,
        status: "active",
        _id: { $in: userIds }
    }).select("-password -email");

    // Lấy 20 tin nhắn gần nhất trong phòng
    const messages = await Message.find({
        room_id: req.params.roomId
    }).limit(20).sort({ createdAt: -1 });

    // Đảo ngược lại mảng tin nhắn để hiển thị theo thứ tự từ cũ đến mới
    messages.reverse();

    // Lấy thông tin "lastOnline" của người dùng
    const lastOnline = getLastOnlineTime(user.lastOnline);
    user["lastOnlineTime"] = lastOnline;

    // Lấy tin nhắn có hình ảnh trong phòng
    const listMessagesWithImages = await Message.find({
        room_id: req.params.roomId,
        images: { $exists: true, $not: { $size: 0 } },
        deleted: false
    })
        .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian
        .limit(20)
        .select("images");

    // Lấy tin nhắn mới nhất của người dùng trong phòng
    const userMessages = await Promise.all(
        listUsers.map(async (user) => {

            //lấy phòng chứa 2 ng
            const room = await Room.findOne({
                user_id: { $all: [user._id, res.locals.user.id] },
                deleted: false
            });

            // Lấy tin nhắn mới nhất
            const latestMessage = await Message.findOne({
                room_id: room._id  // Lọc theo phòng
            })
                .sort({ createdAt: -1 })
                .limit(1).select("content images files createdAt call")

            // Định dạng nội dung tin nhắn nếu là hình ảnh hoặc file
            let messageContent = latestMessage ? latestMessage.content : null;
            if (latestMessage) {
                if (latestMessage.sender == res.locals.user.id) {
                    if (latestMessage.images && latestMessage.images.length > 0) {
                        messageContent = "Bạn: Đã gửi một hình ảnh";
                    } else if (latestMessage.files && latestMessage.files.length > 0) {
                        messageContent = "Bạn: Đã gửi một file";
                    }else if(latestMessage.call.title){
                        messageContent = `${latestMessage.call.title}`
                    } 
                    else {
                        messageContent = `Bạn: ${latestMessage.content}`
                    }
                } else {
                    if (latestMessage.images && latestMessage.images.length > 0) {
                        messageContent = `${user.fullName} đã gửi một hình ảnh`;
                    } else if (latestMessage.files && latestMessage.files.length > 0) {
                        messageContent = `${user.fullName} gửi một file`;
                    }else if(latestMessage.call.title){
                        messageContent = `${latestMessage.call.title}`
                    }  else {
                        messageContent = `${latestMessage.content}`
                    }
                }
            }

            // Định dạng thời gian của tin nhắn
            const messageTime = latestMessage ? moment(latestMessage.createdAt) : null;

            // Nếu có thời gian tin nhắn
            const formattedMessageTime = messageTime
                ? moment(messageTime).fromNow()
                : "Chưa có tin nhắn";


            return {
                user,
                latestMessage: {
                    content: messageContent,
                    formattedMessageTime: formattedMessageTime,
                    createdAt: latestMessage ? latestMessage.createdAt : null
                }
            };
        })
    );

    

    // Gửi dữ liệu đến view
    res.render("client/pages/chat/index.pug", {
        pageTitle: "Trang chat",
        messages: messages,
        userreceive: user,
        room: userInRoom,
        listUsers: userMessages,  // Gửi danh sách người dùng kèm tin nhắn mới nhất
        listImages: listMessagesWithImages
    });
};

export const videoCall = async (req: Request, res: Response) => {

    chatSocket.chatSocket(res)

    const userInRoom = await Room.findOne({
        _id: req.params.roomId
    })
    let objectCall

    const userId = req.params.roomId
    if (userInRoom) {
        objectCall = {
            caller: res.locals.user.id,
            callee: userInRoom.user_id
        }
    }
    res.render("client/pages/chat/call.pug", {
        objectCall: objectCall
    })
}
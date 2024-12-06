import Chat from "twilio/lib/rest/Chat";
import Message from "../model/message.model";
import Room from "../model/room.model";
import { Response } from "express";
import User from "../model/user.model";
import * as uploadToCloudinary from "../helpers/uploadToCloudinary"

interface MessageData {
    content: string,
    images: [],
    roomId: String,
    idUserReceiver: String,
    files: {
        buffer: Buffer,
        name: string
    }[]
}
interface UserInfo {
    userId: string;
    peerId: string;
}

const arrUserInfo: UserInfo[] = [];
export const chatSocket = async (res: Response) => {
    const userId = res.locals.user.id

    const fullName = res.locals.user.fullName
    global._io.once('connection', (socket) => {



        socket.on('CLIENT_SEND_MESSAGE', async (data: MessageData) => {
            const room = await Room.findOne({
                deleted: false, // Phòng chưa bị xóa
                _id: data.roomId
            });
            let images = []


            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary.uploadToCloudinary(imageBuffer)
                images.push(link)
            }

            let files = []


            for (const fileBuffer of data.files) {
                const nameFile = fileBuffer.name.split(":")[0]
                const link = await uploadToCloudinary.uploadSingle(fileBuffer.buffer)
                files.push({ link: link, name: nameFile });

            }

            if (!room) {
                const room = new Room({
                    user_id: [res.locals.user.id],

                })
            }
            const filteredUserIds = room.user_id.filter(userId => userId != res.locals.user.id);
            const userReceiver = await User.findOne({
                deleted: false,
                status: "active",
                _id: filteredUserIds
            }).select("fullName avatar");
            const userSender = await User.findOne({
                deleted: false,
                status: "active",
                _id: res.locals.user.id
            }).select("fullName avatar");

            if (data) {
                const message = new Message({
                    sender: userId,
                    room_id: room.id,
                    content: data.content,
                    images: images,
                    files: files
                });
                await message.save()
            }

            console.log(userSender)
            console.log(userReceiver)
            global._io.emit('SERVER_RETURN_MESSAGE', {
                sender: userSender,
                room_id: room.id,
                content: data.content,
                images: images,
                files: files,
                receiver: userReceiver
            })
        });
        socket.on("CLIENT_REGISTER", async (data: UserInfo) => {
            const exists = arrUserInfo.some(user => user.userId === data.userId);

            if (exists) {
                const user = arrUserInfo.find(user => user.userId === data.userId);
                if (user) {
                    user.peerId = data.peerId;  // Cập nhật peerId
                }
            } else {
                const newUser = { userId: userId, peerId: "" };
                arrUserInfo.push(newUser);
            }
            console.log(arrUserInfo);  // In mảng sau khi cập nhật
        })
        // Khi nhận yêu cầu gọi video từ người gọi
        socket.on("CLIENT_CALL_VIDEO", async (data) => {
            const callerId = data.callerId;
            const roomId = data.roomID

            const userIds = arrUserInfo.map(user => user.userId);

            const matchedUsers = await Room.findOne({
                user_id: { $in: userIds }, // Lấy user_id trùng khớp với arrUserInfo
            }).select('user_id'); // Chỉ lấy field user_id

            const user = await User.findOne({
                _id: callerId
            }).select("fullName")

            const objectMessage = {
                sender: callerId,
                room_id: roomId,
                call: {
                    title: "Đang gọi dến",
                    statusCall: "called",
                    peerIdCall: "",
                    peerIdReceiver: ""
                }
            }
            const message = new Message(objectMessage)
            await message.save()


            if (matchedUsers && matchedUsers.user_id.length > 0) {
                for (const calleeId of matchedUsers.user_id) {
                    if (calleeId == callerId) continue
                    global._io.to(calleeId).emit("SERVER_CALL_VIDEO", {
                        callerId: user,
                        calleeId: calleeId,
                        roomId: roomId
                    });
                }
            } else {
                // xu li emit toi nguoi goi
                console.log("Không tìm thấy người nhận.");
            }
        });

        socket.on("CLIENT_LOGIN", async (userId) => {
            await User.updateOne({
                _id: userId

            }, {
                statusOnline: "online"
            })
            const user = arrUserInfo.find(user => user.userId === userId);

            if (!user) {

                const newUser = { userId: userId, peerId: "" };
                arrUserInfo.push(newUser);
            }
            else {


            }
            console.log(arrUserInfo)
            socket.join(userId);
        })
        // call 
        socket.on("CLIENT_SAVE_PEER", async (data) => {

            // Tìm userId trong arrUserInfo
            const user = arrUserInfo.find(user => user.userId === data.userId);

            if (user) {
                user.peerId = data.peerId;

                //kiem tra peerId day du chưa
                const userIds = arrUserInfo.map(user => user.userId);

                // Tìm phòng trong database với user_id khớp với userIds trong mảng arrUserInfo
                const room = await Room.findOne({
                    user_id: { $in: userIds }  // Lấy user_id trùng khớp với userIds trong mảng arrUserInfo
                }).select('user_id');

                // Kiểm tra nếu không tìm thấy phòng
                if (!room) {
                    console.log('Không tìm thấy phòng');
                    return;
                }

                // Lấy danh sách user_id trong phòng
                const userIdsInRoom = room.user_id;

                // Kiểm tra các người dùng trong arrUserInfo có peerId bị thiếu không
                const missingPeerIds = arrUserInfo.filter(user =>
                    userIdsInRoom.includes(user.userId) && user.peerId === ''
                );

                // Nếu có người dùng thiếu peerId
                if (missingPeerIds.length > 0) {
                    console.log('Các người dùng thiếu peerId:', missingPeerIds);
                } else {
                    // Lấy peerId của người gọi (người thực hiện cuộc gọi)
                    const peerIdCall = arrUserInfo.find(user => user.userId === data.userId)?.peerId;

                    const peerIdReceiver = arrUserInfo
                        .filter(user => userIdsInRoom.includes(user.userId) && user.userId !== data.userId)
                        .map(user => user.peerId)[0];

                    if (peerIdCall && peerIdReceiver) {
                        const userCall = arrUserInfo.find(user => user.peerId === peerIdReceiver);



                        //cap nhat trang thai cuoc goi la dang dien ra
                        const message = await Message.findOne({
                            sender: userCall.userId,
                            room_id: room._id,
                            "call.title": { $exists: true }
                        })
                            .sort({ createdAt: -1 })

                        if (message) {
                            const updatedMessage = await Message.updateOne(
                                { _id: message._id },
                                {
                                    $set: {
                                        "call.title": "Cuộc gọi đang diễn ra",  // Update title
                                        "call.statusCall": "calling",           // Update status
                                        "call.peerIdCall": peerIdCall,          // Set peerIdCall as a string
                                        "call.peerIdReceiver": peerIdReceiver   // Set peerIdReceiver as a string
                                    }

                                }
                            );
                        }


                        global._io.emit("SERVER_RETURN_MAKE_CALL", {
                            peerIdCall: peerIdCall,
                            peerIdReceiver: peerIdReceiver,
                        });
                    } else {
                        // In ra lỗi nếu không tìm thấy peerId hợp lệ cho cuộc gọi
                        console.log("Không tìm thấy peerId hợp lệ cho cuộc gọi.");
                    }
                }
            } else {

            }

        })

        socket.on("USER_DISCONNECTED_PEER", async (id) => {
            const userCaller = arrUserInfo.find(user => user.peerId === id);
            console.log(id)
            const message = await Message.findOne({
                "call.peerIdCall": id
            })
                .sort({ createdAt: -1 })
            if (message) {
                const updatedMessage = await Message.updateOne(
                    { _id: message._id },
                    {
                        $set: {
                            "call.title": "Cuộc gọi đã kết thúc",
                            "call.statusCall": "success"
                        }
                    }
                );
            }

            if (userCaller) {
                const userCall = await User.findOne({
                    _id: userCaller.userId
                }).select("fullName")


                userCaller.peerId = "";
                socket.broadcast.emit("USER_RETURN_DISCONNECTED_PEER", userCall)
            } else {
            }
        });
        socket.on("CLIENT_REJECT_CALL", async (data) => {
            //cap nhat trang trai cuoc goi bi nhỡ
            const message = await Message.findOne({
                sender: data.userId._id,
                room_id: data.roomId,
                "call.title": { $exists: true }
            })
                .sort({ createdAt: -1 })

            if (message) {
                const updatedMessage = await Message.updateOne(
                    { _id: message._id },
                    {
                        $set: {
                            "call.title": "Cuộc gọi bị nhỡ",
                            "call.statusCall": "call fail"
                        }
                    }
                );
            }
        })

    })
}
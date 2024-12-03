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
            console.log(files)

            if (!room) {
                const room = new Room({
                    user_id: [res.locals.user.id],

                })
            }
            const filteredUserIds = room.user_id.filter(userId => userId == res.locals.user.id);
            const userReceiver = await User.findOne({
                deleted: false,
                status: "active",
                _id: filteredUserIds
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
            global._io.emit('SERVER_RETURN_MESSAGE', {
                sender: userId,
                room_id: room.id,
                content: data.content,
                images: images,
                files: files,
                receiver: userReceiver
            })
        });
        socket.on("CLIENT_REGISTER", async (data: UserInfo) => {
            console.log("helo")
            const exists = arrUserInfo.some(user => user.userId === data.userId);

            if (exists) {
                // Nếu tồn tại, tìm người dùng và thay đổi peerId của người đó
                const user = arrUserInfo.find(user => user.userId === data.userId);
                if (user) {
                    user.peerId = data.peerId;  // Cập nhật peerId
                }
            } else {
                // Nếu không tồn tại, thêm đối tượng mới vào mảng
                arrUserInfo.push(data);
            }
            console.log(arrUserInfo);  // In mảng sau khi cập nhật
        })
        // Khi nhận yêu cầu gọi video từ người gọi
        socket.on("CLIENT_CALLVIDEO", (data) => {
            const callerId = data.callerId;
            const calleeId = data.calleeId  // Lấy userId của người nhận

            // Kiểm tra xem người nhận có trong danh sách không
            const user = arrUserInfo.find(user => user === calleeId);

            if (user) {
                // Nếu người nhận có trong danh sách, gửi yêu cầu gọi video tới người nhận
                // Gửi sự kiện đến người nhận với peerId của người gọi
                console.log(calleeId)
                global._io.to(calleeId).emit("SERVER_CALLVIDEO", {
                    callerId: callerId,  // userId của người gọ
                    calleeId:calleeId
                });
                console.log("Gửi tới người nhận ")
            } else {
                console.log("Không tìm thấy người nhận.");
            }
        });

        socket.on("CLIENT_LOGIN", (userId) => {
            console.log("ok")
            const user = arrUserInfo.find(user => user === userId);
            if (!user) {
                arrUserInfo.push(userId);
            }
            else {
            }
            console.log(arrUserInfo)
            socket.join(userId);

        })
    })
}
import Chat from "twilio/lib/rest/Chat";
import Message from "../model/message.model";
import Room from "../model/room.model";
import { Response } from "express";
import User from "../model/user.model";
import * as uploadToCloudinary from "../helpers/uploadToCloudinary"

interface MessageData {
    content: string,
    images: []
}
export const chatSocket = async (res: Response) => {
    const userId = res.locals.user.id

    const fullName = res.locals.user.fullName
    global._io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (data: MessageData) => {
            const room = await Room.findOne({
                deleted: false,
                user_id: res.locals.user.id
            })
            let images = []
            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary.uploadToCloudinary(imageBuffer)
                images.push(link)
            }

            if(!room){
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
                    images:images
                });
                await message.save()
            }
            global._io.emit('SERVER_RETURN_MESSAGE', {
                sender: userId,
                room_id: room.id,
                content: data.content,
                images:images,
                receiver:userReceiver
            })
        });

    })
}
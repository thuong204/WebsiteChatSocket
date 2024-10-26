import Chat from "twilio/lib/rest/Chat";
import Message from "../model/message.model";
import Room from "../model/room.model";
import { Response } from "express";
import { _io } from "../index";

interface MessageData {
    content: string;
}
export const chatSocket = async (res: Response) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (data: MessageData) => {
            const room = await Room.findOne({
                deleted: false,
                user_id: res.locals.user.id
            })
            if (data) {
                const message = new Message({
                    sender: userId,
                    room_id: room.id,
                    content: data,
                });
                await message.save()
            }
        });
    })
}
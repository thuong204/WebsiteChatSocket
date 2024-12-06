import { Response } from "express"
import User from "../model/user.model"

export const callSocket = async (res: Response) => {

    const userId = res.locals.user.id
    const fullName = res.locals.user.fullNamez
    global._io.once('connection', (socket) => {
        // socket.on("CLIENT_SAVE_PEER",(data)=>{
        //     console.log(`${data} heo`)

        // })

        socket.on("CLIENT_ACCEPT_CALL",(data) =>{
            console.log("ok")
        })

        // // Khi kết nối bị ngắt (người dùng đóng tab hoặc rời khỏi trang)
        // socket.on('disconnect', async () => {
        //     console.log('User disconnected:', socket.id);
        //     try {
        //         // Cập nhật trạng thái người dùng thành "offline"
        //         const userId = res.locals.user.id; 
        //         await User.updateOne({
        //             _id:res.locals.user.id,

        //         }, {
        //             statusOnline:"offline",
        //             lastOnline: new Date()
        //         })
        //         console.log(`User ${userId} is offline`);
        //     } catch (error) {
        //         console.error('Error updating status:', error);
        //     }
        // });
    })
}
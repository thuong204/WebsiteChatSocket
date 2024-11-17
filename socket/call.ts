import { Response } from "express"

export const chatSocket = async (res: Response) => {
    const userId = res.locals.user.id

    const fullName = res.locals.user.fullNamez
    global._io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_PEER",(data)=>{
            console.log(`${data} heo`)

        })
    })
}
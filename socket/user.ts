import { Response } from "express"
import User from "../model/user.model"
import Room from "../model/room.model"
export const userSocket = async (res: Response) => {
    const userId = res.locals.user.id

    const fullName = res.locals.user.fullName
    global._io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {



            //id cua nguoi gui
            const myUserA = res.locals.user.id

            //id của nguoi nhan
            const userB = userId

            //them id cua nguoi gui(a) vao acceptfriend cua nguoi nhan(b)
            const userAinBExist = await User.findOne({
                _id: userB,
                acceptFriends: myUserA
            })
            if (!userAinBExist) {
                await User.updateOne({
                    _id: userB
                }, {
                    $push: { acceptFriends: myUserA }
                })
            }

            //them id cua nguoi nhan vao requestfriend cua nguoi gui

            const userBinAExist = await User.findOne({
                _id: myUserA,
                acceptFriends: userB
            })
            if (!userBinAExist) {
                await User.updateOne({
                    _id: myUserA
                }, {
                    $push: { requestFriends: userB }
                })
            }
        })

        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            console.log("hủy yêu cầu")

            //id cua nguoi gui
            const myUserA = res.locals.user.id

            //id của nguoi nhan
            const userB = userId

            //xoa id cua nguoi gui(a) trong acceptfriend cua nguoi nhan(b)

            await User.updateOne({
                _id: userB
            }, {
                $pull: { acceptFriends: myUserA }
            })


            //xoa id cua nguoi nhan vao requestfriend cua nguoi gui

            await User.updateOne({
                _id: myUserA
            }, {
                $pull: { requestFriends: userB }
            })

        })
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            console.log("chấp nhận kết bạn")

            //id cua nguoi nhan
            const myUserA = res.locals.user.id

            //id của nguoi gui
            const userB = userId

            //xoa id cua nguoi gui(b) trong acceptfriend cua nguoi nhan(a)

            await User.updateOne({
                _id: myUserA
            }, {
                $pull: { acceptFriends: userB }
            })


            //xoa id cua nguoi nhan vao requestfriend cua nguoi gui

            await User.updateOne({
                _id: userB
            }, {
                $pull: { requestFriends: myUserA }
            })

            //tao phong chat cho 2 nguoi
            const exsistroomUser = await Room.findOne({
                user_id: { $all: [myUserA, userB] },
                deleted: false,
                $expr: { $eq: [{ $size: "$user_id" }, 2] }
            });
            if (!exsistroomUser) {
                const room = new Room({
                    user_id: [myUserA, userB]
                })
                await room.save()
            }

            const roomUser = await Room.findOne({
                user_id: { $all: [myUserA, userB] },
                deleted: false,
                $expr: { $eq: [{ $size: "$user_id" }, 2] }
            });



            //them vao danh sach ban be cua 2 nguoi


            // Kiểm tra và thêm bạn bè vào danh sách của myUserA
            const existingFriendA = await User.findOne({
                _id: myUserA,
                "listFriends.user_id": userB, // Kiểm tra userB đã tồn tại trong listFriends chưa
            });

            if (!existingFriendA) {
                await User.updateOne(
                    { _id: myUserA },
                    {
                        $push: {
                            listFriends: {
                                user_id: userB,
                                room_id: roomUser._id,
                            },
                        },
                    }
                );
            }

            // Kiểm tra và thêm bạn bè vào danh sách của userB
            const existingFriendB = await User.findOne({
                _id: userB,
                "listFriends.user_id": myUserA, // Kiểm tra myUserA đã tồn tại trong listFriends chưa
            });

            if (!existingFriendB) {
                await User.updateOne(
                    { _id: userB },
                    {
                        $push: {
                            listFriends: {
                                user_id: myUserA,
                                room_id: roomUser._id,
                            },
                        },
                    }
                );
            }

            console.log("Lưu thành công")
        })
    })
}
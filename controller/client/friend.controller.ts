import { Request, Response } from "express";
import User from "../../model/user.model";
import * as userSocket from "../../socket/user";

export const index = async (req: Request, res: Response) => {
    userSocket.userSocket(res)

    const listUsers = await User.find({
        deleted: false,
        listFriends: {
          $elemMatch: { user_id: res.locals.user.id } // Kiểm tra res.locals.user.id có trong user_id của listFriends
        }
      }).select("fullName avatar");
      
    res.render("client/pages/friend/index", {
        pageTitle: "Bạn bè",
        listUsers:listUsers
    })

}
export const suggestion = async (req: Request, res: Response) => {
    userSocket.userSocket(res)

    const myUser = await User.findOne({
        _id: res.locals.user.id
    })

    const listUsers = await User.find({
        // vua ko la id cua minh vua ko la danh sach da gui loi moi ket ban
        $and: [
            {
                _id: { $ne: res.locals.user.id }
            },
            {
                _id: { $nin: myUser.requestFriends }
            },
            {
                _id: { $nin: myUser.acceptFriends }
            },
            {
                listFriends: {
                    $not: {
                        $elemMatch: { user_id: res.locals.user.id }
                    }
                }, // Không nằm trong danh sách bạn bè
            }
        ],
        deleted: false,
        status: "active"
    })
        .limit(20)
        .sort({ lastOnline: -1 })
        .select("fullName avatar id");

    res.render("client/pages/friend/suggestion", {
        pageTitle: "Gợi ý kết bạn",
        listUsers: listUsers
    })
}

export const send = async (req: Request, res: Response) => {

    userSocket.userSocket(res)

    const myUser = await User.findOne({
        _id: res.locals.user.id
    })

    const listUsers = await User.find({
        // vua ko la id cua minh vua ko la danh sach da gui loi moi ket ban
        _id: { $in: myUser.requestFriends },
        deleted: false,
        status: "active"
    })

    res.render("client/pages/friend/request", {
        pageTitle: "Lời mòi đã gửi",
        listUsers: listUsers
    })
    


}

export const accept = async (req: Request, res: Response) => {

    userSocket.userSocket(res)

    const myUser = await User.findOne({
        _id: res.locals.user.id
    })

    const listUsers = await User.find({
        // vua ko la id cua minh vua ko la danh sach da gui loi moi ket ban
        _id: { $in: myUser.acceptFriends },
        deleted: false,
        status: "active"
    })
    res.render("client/pages/friend/accept", {
        pageTitle: "Lời mời kết bạn",
        listUsers: listUsers
    })
}
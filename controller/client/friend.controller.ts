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
        listUsers: listUsers
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
        _id: { $in: myUser.acceptFriends },
        deleted: false,
        status: "active"
    })
    res.render("client/pages/friend/accept", {
        pageTitle: "Lời mời kết bạn",
        listUsers: listUsers
    })
}
export const find = async (req: Request, res: Response) => {

    userSocket.userSocket(res)

    const listUsers = await User.find({
        deleted: false,
        status: "active",
        _id: { $ne: res.locals.user.id }
    }).select("fullName avatar").lean().limit(20);
    
    const currentUser = await User.findById(res.locals.user.id).select("acceptFriends requestFriends listFriends").lean();
    
    const usersWithRelationship = listUsers.map(user => {
        const userId = user._id.toString();
    
        let relationship = "none";
    
        if (currentUser.listFriends.some(friend => friend.user_id === userId)) {
            relationship = "friends";
        } else if (currentUser.requestFriends.includes(userId)) {
            relationship = "requested";
        } else if (currentUser.acceptFriends.includes(userId)) {
            relationship = "invited";
        }
    
        return {
            ...user, // Không cần dùng _doc nữa
            relationship,
        };
    });

    const relationshipPriority: Record<string, number> = {
        none: 0,
        requested: 1,
        invited: 2,
        friends: 3,
    };
    
    usersWithRelationship.sort((a, b) => {
        return relationshipPriority[a.relationship] - relationshipPriority[b.relationship];
    });

    res.render("client/pages/friend/find", {
        pageTitle: "Tìm kiếm bạn bè",
        listUsers: usersWithRelationship, // Sử dụng danh sách với trạng thái quan hệ
    });

}

export const searchApi = async (req: Request, res: Response) => {
    try {
        const keyword = typeof req.query.keyword === "string" ? req.query.keyword.trim() : "";

        const keywordRegex = new RegExp(keyword, "i")


        const searchCondition = {
            _id: { $ne: res.locals.user.id }, // Không phải chính người dùng hiện tại
            deleted: false, // Lọc các tài khoản chưa bị xóa
            status: "active", // Lọc các tài khoản đang hoạt động
            fullName: keywordRegex, // Tìm kiếm gần đúng theo tên, không phân biệt chữ hoa chữ thường


        };


        const listAllUsers = await User.find(searchCondition).select("fullName avatar").limit(50);
        res.json({
            code: 200,
            data: listAllUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        });
    }

}
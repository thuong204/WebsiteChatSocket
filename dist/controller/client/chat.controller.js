"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoCall = exports.roomMessage = exports.fetchMessage = exports.index = void 0;
const room_model_1 = __importDefault(require("../../model/room.model"));
const message_model_1 = __importDefault(require("../../model/message.model"));
const chatSocket = __importStar(require("../../socket/chat"));
const user_model_1 = __importDefault(require("../../model/user.model"));
const moment_1 = __importDefault(require("moment"));
const getLastOnline_1 = require("../../helpers/getLastOnline");
require("moment/locale/vi");
moment_1.default.locale('vi');
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        chatSocket.chatSocket(res);
        const rooms = yield room_model_1.default.find({
            deleted: false,
            user_id: res.locals.user.id
        });
        let userIds = [];
        rooms.forEach(room => {
            userIds.push(...room.user_id);
        });
        userIds = userIds.filter(id => id !== res.locals.user.id);
        const listUsers = yield user_model_1.default.find({
            deleted: false,
            status: "active",
            _id: { $in: userIds }
        }).select("fullName avatar statusOnline");
        const userMessages = yield Promise.all(listUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const room = yield room_model_1.default.findOne({
                user_id: { $all: [user._id, res.locals.user.id] },
                deleted: false
            });
            const specificRoom = rooms.find(room => {
                const members = room.user_id.map(id => id.toString());
                return (members.includes(user._id.toString()) &&
                    members.includes(res.locals.user.id.toString()) &&
                    members.length === 2);
            });
            const latestMessage = yield message_model_1.default.findOne({
                room_id: room._id
            })
                .sort({ createdAt: -1 })
                .limit(1).select("content images files createdAt room_id call");
            if (!latestMessage)
                return {
                    user,
                    room_id: specificRoom ? specificRoom._id : null
                };
            let messageContent = latestMessage ? latestMessage.content : null;
            if (latestMessage) {
                if (latestMessage.sender == res.locals.user.id) {
                    if (latestMessage.images && latestMessage.images.length > 0) {
                        messageContent = "Bạn: Đã gửi một hình ảnh";
                    }
                    else if (latestMessage.files && latestMessage.files.length > 0) {
                        messageContent = "Bạn: Đã gửi một file";
                    }
                    else if (latestMessage.call.title) {
                        messageContent = `${latestMessage.call.title}`;
                    }
                    else {
                        messageContent = `Bạn: ${latestMessage.content}`;
                    }
                }
                else {
                    if (latestMessage.images && latestMessage.images.length > 0) {
                        messageContent = "Đã gửi một hình ảnh";
                    }
                    else if (latestMessage.files && latestMessage.files.length > 0) {
                        messageContent = "Đã gửi một file";
                    }
                    else if (latestMessage.call.title) {
                        messageContent = `${latestMessage.call.title}`;
                    }
                    else {
                        messageContent = `${latestMessage.content}`;
                    }
                }
            }
            const messageTime = latestMessage ? (0, moment_1.default)(latestMessage.createdAt) : null;
            const formattedMessageTime = messageTime
                ? (0, moment_1.default)(messageTime).fromNow()
                : "Chưa có tin nhắn";
            return {
                user,
                latestMessage: Object.assign(Object.assign({}, latestMessage.toObject()), { content: messageContent, formattedMessageTime: formattedMessageTime }),
                room_id: specificRoom ? specificRoom._id : null
            };
        })));
        res.render("client/pages/chat/chathello.pug", {
            pageTitle: "Trang chủ",
            listUsers: userMessages,
        });
    }
    catch (error) {
        console.error("Error loading chat data:", error);
        res.status(500).send("Server Error");
    }
});
exports.index = index;
const fetchMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const receiverId = req.params.receiverId;
    const idsToSearch = [userId, receiverId];
    const room = yield room_model_1.default.findOne({
        user_id: { $all: idsToSearch }
    });
    if (room) {
        const messages = yield message_model_1.default.find({
            room_id: room.id
        }).select("sender content room_id images files call").limit(20).sort({
            createdAt: "desc"
        });
        messages.reverse();
        const filteredUserIds = room.user_id.filter(userId => userId !== res.locals.user.id);
        const user = yield user_model_1.default.findOne({
            deleted: false,
            status: "active",
            _id: filteredUserIds
        }).select("id fullName avatar lastOnline statusOnline");
        const lastOnline = (0, getLastOnline_1.getLastOnlineTime)(user.lastOnline);
        user["lastOnlineTime"] = lastOnline;
        const listMessagesWithImages = yield message_model_1.default.find({
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
        });
    }
    else {
        res.json({
            "code": 200,
            "data": "null"
        });
    }
});
exports.fetchMessage = fetchMessage;
const roomMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    chatSocket.chatSocket(res);
    const userInRoom = yield room_model_1.default.findOne({
        deleted: false,
        _id: req.params.roomId
    }).select("user_id");
    const filteredUserIds = userInRoom.user_id.filter(userId => userId !== res.locals.user.id);
    const user = yield user_model_1.default.findOne({
        deleted: false,
        status: "active",
        _id: filteredUserIds
    }).select("fullName avatar statusOnline lastOnline");
    const rooms = yield room_model_1.default.find({
        deleted: false,
        user_id: res.locals.user.id
    });
    let userIds = [];
    for (const room of rooms) {
        userIds = userIds.concat(room.user_id);
    }
    userIds = userIds.filter(id => id !== res.locals.user.id);
    const listUsers = yield user_model_1.default.find({
        deleted: false,
        status: "active",
        _id: { $in: userIds }
    }).select("-password -email");
    const messages = yield message_model_1.default.find({
        room_id: req.params.roomId
    }).limit(20).sort({ createdAt: -1 });
    messages.reverse();
    const lastOnline = (0, getLastOnline_1.getLastOnlineTime)(user.lastOnline);
    user["lastOnlineTime"] = lastOnline;
    const listMessagesWithImages = yield message_model_1.default.find({
        room_id: req.params.roomId,
        images: { $exists: true, $not: { $size: 0 } },
        deleted: false
    })
        .sort({ createdAt: -1 })
        .limit(20)
        .select("images");
    const userMessages = yield Promise.all(listUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const room = yield room_model_1.default.findOne({
            user_id: { $all: [user._id, res.locals.user.id] },
            deleted: false
        });
        const latestMessage = yield message_model_1.default.findOne({
            room_id: room._id
        })
            .sort({ createdAt: -1 })
            .limit(1).select("content images files createdAt call");
        let messageContent = latestMessage ? latestMessage.content : null;
        if (latestMessage) {
            if (latestMessage.sender == res.locals.user.id) {
                if (latestMessage.images && latestMessage.images.length > 0) {
                    messageContent = "Bạn: Đã gửi một hình ảnh";
                }
                else if (latestMessage.files && latestMessage.files.length > 0) {
                    messageContent = "Bạn: Đã gửi một file";
                }
                else if (latestMessage.call.title) {
                    messageContent = `${latestMessage.call.title}`;
                }
                else {
                    messageContent = `Bạn: ${latestMessage.content}`;
                }
            }
            else {
                if (latestMessage.images && latestMessage.images.length > 0) {
                    messageContent = `Đã gửi một hình ảnh`;
                }
                else if (latestMessage.files && latestMessage.files.length > 0) {
                    messageContent = `Đã gửi một file`;
                }
                else if (latestMessage.call.title) {
                    messageContent = `${latestMessage.call.title}`;
                }
                else {
                    messageContent = `${latestMessage.content}`;
                }
            }
        }
        const messageTime = latestMessage ? (0, moment_1.default)(latestMessage.createdAt) : null;
        const formattedMessageTime = messageTime
            ? (0, moment_1.default)(messageTime).fromNow()
            : "Chưa có tin nhắn";
        return {
            user,
            latestMessage: {
                content: messageContent,
                formattedMessageTime: formattedMessageTime,
                createdAt: latestMessage ? latestMessage.createdAt : null
            }
        };
    })));
    res.render("client/pages/chat/index.pug", {
        pageTitle: "Trang chat",
        messages: messages,
        userreceive: user,
        room: userInRoom,
        listUsers: userMessages,
        listImages: listMessagesWithImages
    });
});
exports.roomMessage = roomMessage;
const videoCall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    chatSocket.chatSocket(res);
    const userInRoom = yield room_model_1.default.findOne({
        _id: req.params.roomId
    });
    let objectCall;
    const userId = req.params.roomId;
    if (userInRoom) {
        objectCall = {
            caller: res.locals.user.id,
            callee: userInRoom.user_id
        };
    }
    res.render("client/pages/chat/call.pug", {
        objectCall: objectCall
    });
});
exports.videoCall = videoCall;

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
exports.chatSocket = void 0;
const message_model_1 = __importDefault(require("../model/message.model"));
const room_model_1 = __importDefault(require("../model/room.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const uploadToCloudinary = __importStar(require("../helpers/uploadToCloudinary"));
const arrUserInfo = [];
const chatSocket = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    global._io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const room = yield room_model_1.default.findOne({
                deleted: false,
                _id: data.roomId
            });
            let images = [];
            for (const imageBuffer of data.images) {
                const link = yield uploadToCloudinary.uploadToCloudinary(imageBuffer);
                images.push(link);
            }
            let files = [];
            for (const fileBuffer of data.files) {
                const nameFile = fileBuffer.name.split(":")[0];
                const link = yield uploadToCloudinary.uploadSingle(fileBuffer.buffer);
                files.push({ link: link, name: nameFile });
            }
            if (!room) {
                const room = new room_model_1.default({
                    user_id: [res.locals.user.id],
                });
            }
            const filteredUserIds = room.user_id.filter(userId => userId != res.locals.user.id);
            const userReceiver = yield user_model_1.default.findOne({
                deleted: false,
                status: "active",
                _id: filteredUserIds
            }).select("fullName avatar");
            const userSender = yield user_model_1.default.findOne({
                deleted: false,
                status: "active",
                _id: res.locals.user.id
            }).select("fullName avatar");
            if (data) {
                const message = new message_model_1.default({
                    sender: userId,
                    room_id: room.id,
                    content: data.content,
                    images: images,
                    files: files
                });
                yield message.save();
            }
            console.log(userSender);
            console.log(userReceiver);
            global._io.emit('SERVER_RETURN_MESSAGE', {
                sender: userSender,
                room_id: room.id,
                content: data.content,
                images: images,
                files: files,
                receiver: userReceiver
            });
        }));
        socket.on("CLIENT_REGISTER", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const exists = arrUserInfo.some(user => user.userId === data.userId);
            if (exists) {
                const user = arrUserInfo.find(user => user.userId === data.userId);
                if (user) {
                    user.peerId = data.peerId;
                }
            }
            else {
                const newUser = { userId: userId, peerId: "" };
                arrUserInfo.push(newUser);
            }
            console.log(arrUserInfo);
        }));
        socket.on("CLIENT_CALL_VIDEO", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const callerId = data.callerId;
            const roomId = data.roomID;
            const userIds = arrUserInfo.map(user => user.userId);
            const matchedUsers = yield room_model_1.default.findOne({
                user_id: { $in: userIds },
            }).select('user_id');
            const user = yield user_model_1.default.findOne({
                _id: callerId
            }).select("fullName");
            const objectMessage = {
                sender: callerId,
                room_id: roomId,
                call: {
                    title: "Đang gọi dến",
                    statusCall: "called",
                    peerIdCall: "",
                    peerIdReceiver: ""
                }
            };
            const message = new message_model_1.default(objectMessage);
            yield message.save();
            if (matchedUsers && matchedUsers.user_id.length > 0) {
                for (const calleeId of matchedUsers.user_id) {
                    if (calleeId == callerId)
                        continue;
                    global._io.to(calleeId).emit("SERVER_CALL_VIDEO", {
                        callerId: user,
                        calleeId: calleeId,
                        roomId: roomId
                    });
                }
            }
            else {
                console.log("Không tìm thấy người nhận.");
            }
        }));
        socket.on("CLIENT_LOGIN", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_model_1.default.updateOne({
                _id: userId
            }, {
                statusOnline: "online"
            });
            const user = arrUserInfo.find(user => user.userId === userId);
            if (!user) {
                const newUser = { userId: userId, peerId: "" };
                arrUserInfo.push(newUser);
            }
            else {
            }
            console.log(arrUserInfo);
            socket.join(userId);
        }));
        socket.on("CLIENT_SAVE_PEER", (data) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = arrUserInfo.find(user => user.userId === data.userId);
            if (user) {
                user.peerId = data.peerId;
                const userIds = arrUserInfo.map(user => user.userId);
                const room = yield room_model_1.default.findOne({
                    user_id: { $in: userIds }
                }).select('user_id');
                if (!room) {
                    console.log('Không tìm thấy phòng');
                    return;
                }
                const userIdsInRoom = room.user_id;
                const missingPeerIds = arrUserInfo.filter(user => userIdsInRoom.includes(user.userId) && user.peerId === '');
                if (missingPeerIds.length > 0) {
                    console.log('Các người dùng thiếu peerId:', missingPeerIds);
                }
                else {
                    const peerIdCall = (_a = arrUserInfo.find(user => user.userId === data.userId)) === null || _a === void 0 ? void 0 : _a.peerId;
                    const peerIdReceiver = arrUserInfo
                        .filter(user => userIdsInRoom.includes(user.userId) && user.userId !== data.userId)
                        .map(user => user.peerId)[0];
                    if (peerIdCall && peerIdReceiver) {
                        const userCall = arrUserInfo.find(user => user.peerId === peerIdReceiver);
                        const message = yield message_model_1.default.findOne({
                            sender: userCall.userId,
                            room_id: room._id,
                            "call.title": { $exists: true }
                        })
                            .sort({ createdAt: -1 });
                        if (message) {
                            const updatedMessage = yield message_model_1.default.updateOne({ _id: message._id }, {
                                $set: {
                                    "call.title": "Cuộc gọi đang diễn ra",
                                    "call.statusCall": "calling",
                                    "call.peerIdCall": peerIdCall,
                                    "call.peerIdReceiver": peerIdReceiver
                                }
                            });
                        }
                        global._io.emit("SERVER_RETURN_MAKE_CALL", {
                            peerIdCall: peerIdCall,
                            peerIdReceiver: peerIdReceiver,
                        });
                    }
                    else {
                        console.log("Không tìm thấy peerId hợp lệ cho cuộc gọi.");
                    }
                }
            }
            else {
            }
        }));
        socket.on("USER_DISCONNECTED_PEER", (id) => __awaiter(void 0, void 0, void 0, function* () {
            const userCaller = arrUserInfo.find(user => user.peerId === id);
            console.log(id);
            const message = yield message_model_1.default.findOne({
                "call.peerIdCall": id
            })
                .sort({ createdAt: -1 });
            if (message) {
                const updatedMessage = yield message_model_1.default.updateOne({ _id: message._id }, {
                    $set: {
                        "call.title": "Cuộc gọi đã kết thúc",
                        "call.statusCall": "success"
                    }
                });
            }
            if (userCaller) {
                const userCall = yield user_model_1.default.findOne({
                    _id: userCaller.userId
                }).select("fullName");
                userCaller.peerId = "";
                socket.broadcast.emit("USER_RETURN_DISCONNECTED_PEER", userCall);
            }
            else {
            }
        }));
        socket.on("CLIENT_REJECT_CALL", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const message = yield message_model_1.default.findOne({
                sender: data.userId._id,
                room_id: data.roomId,
                "call.title": { $exists: true }
            })
                .sort({ createdAt: -1 });
            if (message) {
                const updatedMessage = yield message_model_1.default.updateOne({ _id: message._id }, {
                    $set: {
                        "call.title": "Cuộc gọi bị nhỡ",
                        "call.statusCall": "call fail"
                    }
                });
            }
        }));
    });
});
exports.chatSocket = chatSocket;

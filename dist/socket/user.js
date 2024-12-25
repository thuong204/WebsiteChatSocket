"use strict";
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
exports.userSocket = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const room_model_1 = __importDefault(require("../model/room.model"));
const userSocket = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    global._io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            const myUserA = res.locals.user.id;
            const userB = userId;
            const userAinBExist = yield user_model_1.default.findOne({
                _id: userB,
                acceptFriends: myUserA
            });
            if (!userAinBExist) {
                yield user_model_1.default.updateOne({
                    _id: userB
                }, {
                    $push: { acceptFriends: myUserA }
                });
            }
            const userBinAExist = yield user_model_1.default.findOne({
                _id: myUserA,
                acceptFriends: userB
            });
            if (!userBinAExist) {
                yield user_model_1.default.updateOne({
                    _id: myUserA
                }, {
                    $push: { requestFriends: userB }
                });
            }
        }));
        socket.on("CLIENT_CANCEL_FRIEND", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("hủy yêu cầu");
            const myUserA = res.locals.user.id;
            const userB = userId;
            yield user_model_1.default.updateOne({
                _id: userB
            }, {
                $pull: { acceptFriends: myUserA }
            });
            yield user_model_1.default.updateOne({
                _id: myUserA
            }, {
                $pull: { requestFriends: userB }
            });
        }));
        socket.on("CLIENT_ACCEPT_FRIEND", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("chấp nhận kết bạn");
            const myUserA = res.locals.user.id;
            const userB = userId;
            yield user_model_1.default.updateOne({
                _id: myUserA
            }, {
                $pull: { acceptFriends: userB }
            });
            yield user_model_1.default.updateOne({
                _id: userB
            }, {
                $pull: { requestFriends: myUserA }
            });
            const exsistroomUser = yield room_model_1.default.findOne({
                user_id: { $all: [myUserA, userB] },
                deleted: false,
                $expr: { $eq: [{ $size: "$user_id" }, 2] }
            });
            if (!exsistroomUser) {
                const room = new room_model_1.default({
                    user_id: [myUserA, userB]
                });
                yield room.save();
            }
            const roomUser = yield room_model_1.default.findOne({
                user_id: { $all: [myUserA, userB] },
                deleted: false,
                $expr: { $eq: [{ $size: "$user_id" }, 2] }
            });
            const existingFriendA = yield user_model_1.default.findOne({
                _id: myUserA,
                "listFriends.user_id": userB,
            });
            console.log(existingFriendA);
            if (!existingFriendA) {
                yield user_model_1.default.updateOne({ _id: myUserA }, {
                    $push: {
                        listFriends: {
                            user_id: userB,
                            room_id: roomUser._id,
                        },
                    },
                });
            }
            const existingFriendB = yield user_model_1.default.findOne({
                _id: userB,
                "listFriends.user_id": myUserA,
            });
            console.log(existingFriendB);
            if (!existingFriendB) {
                yield user_model_1.default.updateOne({ _id: userB }, {
                    $push: {
                        listFriends: {
                            user_id: myUserA,
                            room_id: roomUser._id,
                        },
                    },
                });
            }
        }));
        socket.on("CLIENT_REMOVE_FRIEND", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            const myUserA = res.locals.user.id;
            const userB = userId;
            const roomUser = yield room_model_1.default.findOne({
                user_id: { $all: [myUserA, userB] },
                deleted: false,
                $expr: { $eq: [{ $size: "$user_id" }, 2] }
            });
            yield user_model_1.default.updateOne({ _id: myUserA }, {
                $pull: {
                    listFriends: {
                        user_id: userB,
                        room_id: roomUser._id,
                    },
                },
            });
            yield user_model_1.default.updateOne({ _id: userB }, {
                $pull: {
                    listFriends: {
                        user_id: myUserA,
                        room_id: roomUser._id,
                    },
                },
            });
            console.log("Xóa bạn bè thành công");
        }));
        socket.on("CLIENT_DELETE_REQUEST_FRIEND", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            const myUserA = res.locals.user.id;
            const userB = userId;
            yield user_model_1.default.updateOne({
                _id: myUserA
            }, {
                $pull: { acceptFriends: userB }
            });
            yield user_model_1.default.updateOne({
                _id: userB
            }, {
                $pull: { requestFriends: myUserA }
            });
        }));
    });
});
exports.userSocket = userSocket;

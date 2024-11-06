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
const chatSocket = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullNamez;
    global._io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const room = yield room_model_1.default.findOne({
                deleted: false,
                user_id: res.locals.user.id
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
            console.log(files);
            if (!room) {
                const room = new room_model_1.default({
                    user_id: [res.locals.user.id],
                });
            }
            const filteredUserIds = room.user_id.filter(userId => userId == res.locals.user.id);
            const userReceiver = yield user_model_1.default.findOne({
                deleted: false,
                status: "active",
                _id: filteredUserIds
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
            global._io.emit('SERVER_RETURN_MESSAGE', {
                sender: userId,
                room_id: room.id,
                content: data.content,
                images: images,
                files: files,
                receiver: userReceiver
            });
        }));
    });
});
exports.chatSocket = chatSocket;

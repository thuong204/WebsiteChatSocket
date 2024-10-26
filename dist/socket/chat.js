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
exports.chatSocket = void 0;
const message_model_1 = __importDefault(require("../model/message.model"));
const room_model_1 = __importDefault(require("../model/room.model"));
const index_1 = require("../index");
const chatSocket = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    index_1._io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const room = yield room_model_1.default.findOne({
                deleted: false,
                user_id: res.locals.user.id
            });
            if (data) {
                const message = new message_model_1.default({
                    sender: userId,
                    room_id: room.id,
                    content: data,
                });
                yield message.save();
            }
        }));
    });
});
exports.chatSocket = chatSocket;

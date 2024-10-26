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
exports.roomMessage = exports.fetchMessage = exports.index = void 0;
const room_model_1 = __importDefault(require("../../model/room.model"));
const message_model_1 = __importDefault(require("../../model/message.model"));
const chatSocket = __importStar(require("../../socket/chat"));
const user_model_1 = __importDefault(require("../../model/user.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    chatSocket.chatSocket(res);
    const users = yield user_model_1.default.find({
        deleted: false,
        status: "active",
        _id: { $ne: res.locals.user.id }
    });
    res.render("client/pages/chat/index.pug", {
        pageTitle: "Trang chat",
        users: users
    });
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
        const message = yield message_model_1.default.find({
            room_id: room.id
        });
        res.json({
            "code": 200,
            "data": message
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
    const users = yield user_model_1.default.find({
        deleted: false,
        status: "active",
        _id: { $ne: res.locals.user.id }
    });
    const messages = yield message_model_1.default.find({
        room_id: req.params.roomId
    });
    res.render("client/pages/chat/index.pug", {
        pageTitle: "Trang chat",
        users: users,
        messages: messages
    });
});
exports.roomMessage = roomMessage;

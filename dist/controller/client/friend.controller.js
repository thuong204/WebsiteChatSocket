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
exports.accept = exports.send = exports.suggestion = exports.index = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
const userSocket = __importStar(require("../../socket/user"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    userSocket.userSocket(res);
    const listUsers = yield user_model_1.default.find({
        deleted: false,
        listFriends: {
            $elemMatch: { user_id: res.locals.user.id }
        }
    }).select("fullName avatar");
    res.render("client/pages/friend/index", {
        pageTitle: "Bạn bè",
        listUsers: listUsers
    });
});
exports.index = index;
const suggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    userSocket.userSocket(res);
    const myUser = yield user_model_1.default.findOne({
        _id: res.locals.user.id
    });
    const listUsers = yield user_model_1.default.find({
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
                },
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
    });
});
exports.suggestion = suggestion;
const send = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    userSocket.userSocket(res);
    const myUser = yield user_model_1.default.findOne({
        _id: res.locals.user.id
    });
    const listUsers = yield user_model_1.default.find({
        _id: { $in: myUser.requestFriends },
        deleted: false,
        status: "active"
    });
    res.render("client/pages/friend/request", {
        pageTitle: "Lời mòi đã gửi",
        listUsers: listUsers
    });
});
exports.send = send;
const accept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    userSocket.userSocket(res);
    const myUser = yield user_model_1.default.findOne({
        _id: res.locals.user.id
    });
    const listUsers = yield user_model_1.default.find({
        _id: { $in: myUser.acceptFriends },
        deleted: false,
        status: "active"
    });
    res.render("client/pages/friend/accept", {
        pageTitle: "Lời mời kết bạn",
        listUsers: listUsers
    });
});
exports.accept = accept;

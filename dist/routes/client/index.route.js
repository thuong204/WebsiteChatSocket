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
Object.defineProperty(exports, "__esModule", { value: true });
const chat_route_1 = require("./chat.route");
const user_route_1 = require("./user.route");
const authUser = __importStar(require("../../middlewares/clients/auth.middleware"));
const infoUser = __importStar(require("../../middlewares/clients/user.middleware"));
const friend_route_1 = require("./friend.route");
const clientRoutes = (app) => {
    app.use(`/chat`, authUser.authUser, infoUser.infoUser, chat_route_1.chatRoutes);
    app.use("/user", user_route_1.userRoutes);
    app.use("/friends", authUser.authUser, infoUser.infoUser, friend_route_1.friendRoutes);
};
exports.default = clientRoutes;

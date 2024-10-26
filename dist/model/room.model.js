"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    user_id: [{
            type: String
        }],
    last_message_at: Date,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Room = mongoose_1.default.model("Room", roomSchema, "room");
exports.default = Room;

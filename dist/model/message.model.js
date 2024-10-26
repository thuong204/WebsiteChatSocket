"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender: String,
    room_id: String,
    content: String,
    images: [String],
    attachments: [
        {
            fileType: {
                type: String,
                enum: ["audio", "pdf", "word", "other"],
                required: true
            },
            url: {
                type: String,
                required: true
            },
            fileName: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
const Message = mongoose_1.default.model("Message", messageSchema, "messages");
exports.default = Message;

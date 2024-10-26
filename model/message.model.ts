import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: String,
    room_id: String,
    content: String,
    images: [String],
    attachments: [
        {
            fileType: {
                type: String,
                enum: ["audio", "pdf", "word", "other"],  // Các loại file hỗ trợ
                required: true
            },
            url: {
                type: String,
                required: true  // Đường dẫn đến file
            },
            fileName: String,  // Tên file gốc
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

const Message = mongoose.model("Message", messageSchema, "messages");
export default Message;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: String,
    room_id: String,
    content: String,
    call: {
        title: String,
        statusCall: String,
        peerIdCall:String,
        peerIdReceiver:String
    },
    images: [String],
    files:[{
        link:String,
        name:String
    }],
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

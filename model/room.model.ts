import mongoose from "mongoose"
const roomSchema = new mongoose.Schema({
    user_id: [{
        type:String
    }],
    last_message_at: Date,
    deleted:{
        type:Boolean,
        default: false
    }
},{
    timestamps: true
})

const Room = mongoose.model("Room",roomSchema,"room")
export default Room

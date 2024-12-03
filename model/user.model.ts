import mongoose from "mongoose";
import * as generate from "../helpers/generate"

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        googleId:String,
        gender: {
            type: String,
            enum: ['male', 'female'], 
        },
        statusOnline: {
            type:String, 
            default:"offline"
        },
        listFriends: {
            type:Array,
            default: []
        },
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dwk6tmsmh/image/upload/v1730014980/ul35qvsq9dt0yqgo0jku.png"
        },
        tokenUser:{
            type:String,
            default: generate.generateRandomString(20)
        },
        status: {
            type: String,
            default: "active"
        },
        lastOnline: {
            type:Date,
            default: Date.now()
        },
        dateOfBirth: Date,
        phone:String,
        deleted: {type:Boolean, default:false},
    },
    {
        timestamps: true
    }

)
const User = mongoose.model("User",userSchema,"users")
export default User
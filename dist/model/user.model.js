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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const generate = __importStar(require("../helpers/generate"));
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    password: String,
    googleId: String,
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    statusOnline: {
        type: String,
        default: "offline"
    },
    acceptFriends: Array,
    requestFriends: Array,
    listFriends: [
        {
            user_id: String,
            room_id: String
        }
    ],
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dwk6tmsmh/image/upload/v1730014980/ul35qvsq9dt0yqgo0jku.png"
    },
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    },
    status: {
        type: String,
        default: "active"
    },
    lastOnline: {
        type: Date,
        default: Date.now()
    },
    dateOfBirth: Date,
    phone: String,
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true
});
const User = mongoose_1.default.model("User", userSchema, "users");
exports.default = User;

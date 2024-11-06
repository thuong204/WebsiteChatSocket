"use strict";
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
exports.uploadFields = exports.uploadSingle = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
require('dotenv').config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
};
const uploadToCloudinary = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield streamUpload(buffer);
    return result.url;
});
exports.uploadToCloudinary = uploadToCloudinary;
const uploadSingle = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, exports.uploadToCloudinary)(fileBuffer);
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error('Upload failed');
    }
});
exports.uploadSingle = uploadSingle;
const uploadFields = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const results = {};
    try {
        for (const key in files) {
            results[key] = [];
            const array = files[key];
            for (const item of array) {
                const result = yield (0, exports.uploadToCloudinary)(item.buffer);
                results[key].push(result);
            }
        }
        return results;
    }
    catch (error) {
        console.log(error);
        throw new Error('Upload failed');
    }
});
exports.uploadFields = uploadFields;
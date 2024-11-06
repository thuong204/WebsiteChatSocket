import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET // Click 'View Credentials' below to copy your API secret
});

// Define a type for the upload result
interface CloudinaryUploadResult {
    url: string;
    secure_url: string; // You can include more fields as necessary
}

interface FileBuffer {
    buffer: Buffer; // Dữ liệu tệp
    fieldname?: string; // Tên trường (nếu cần)
}

const streamUpload = (buffer: Buffer): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error: Error | null, result: CloudinaryUploadResult | undefined) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// Main upload function
export const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
    const result = await streamUpload(buffer);
    return result.url; // Return the URL of the uploaded image
};

export const uploadSingle = async (fileBuffer: Buffer): Promise<any> => {
    try {
        const result = await uploadToCloudinary(fileBuffer);
        return result; // Trả về kết quả từ Cloudinary
    } catch (error) {
        console.log(error);
        throw new Error('Upload failed'); // Ném lỗi nếu có
    }
};

// Hàm upload nhiều file
export const uploadFields = async (files: { [key: string]: FileBuffer[] }): Promise<{ [key: string]: any[] }> => {
    const results: { [key: string]: any[] } = {};
    try {
        for (const key in files) {
            results[key] = [];
            const array = files[key];
            for (const item of array) {
                const result = await uploadToCloudinary(item.buffer); // item.buffer là buffer của file
                results[key].push(result); // Lưu kết quả vào mảng
            }
        }
        return results; // Trả về kết quả tổng
    } catch (error) {
        console.log(error);
        throw new Error('Upload failed'); // Ném lỗi nếu có
    }
}
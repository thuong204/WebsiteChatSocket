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

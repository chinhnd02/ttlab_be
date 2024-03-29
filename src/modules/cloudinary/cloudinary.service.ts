// import { Injectable } from '@nestjs/common';
// // import { v2 as cloudinary } from 'cloudinary';
// const streamifier = require('streamifier');
// import * as cloudinary from 'cloudinary';
// import { cloudinaryConfig } from './clould.config';

// cloudinary.v2.config(cloudinaryConfig)



// @Injectable()
// export class CloudinaryService {
//     uploadFile(file: Express.Multer.File): Promise<string> {
//         return new Promise<string>((resolve, reject) => {
//             const uploadStream = cloudinary.v2.uploader.upload_stream(
//                 { folder: 'image_product' },
//                 (error, result) => {
//                     if (error) return reject(error);
//                     resolve(result.secure_url);
//                 },
//             );

//             streamifier.createReadStream(file.buffer).pipe(uploadStream);
//         });
//     }
// }


import { BadRequestException, Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { cloudinaryConfig } from './clould.config';

cloudinary.v2.config(cloudinaryConfig);

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                { folder: 'image_product' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                },
            );
            stream.write(file.buffer);
            stream.end();
        });
    }
    // async deleteImage(url: string): Promise<void> {
    //     const publicId = this.getPublicIdFromUrl(url);
    //     console.log('publicId   :' + publicId);
    //     return new Promise((resolve, reject) => {
    //         cloudinary.v2.uploader.destroy(
    //             'image_product/' + publicId,
    //             (error, result) => {
    //                 if (error) {
    //                     console.log('L');
    //                     reject(error);
    //                 } else {
    //                     console.log('Xóa thành công');
    //                     resolve(result);
    //                 }
    //             },
    //         );
    //     });
    // }
    // private getPublicIdFromUrl(imageUrl: string): string | null {
    //     const regex = /\/([^/]+?)\.(?:jpg|jpeg|png|gif|webp|svg)/;
    //     const match = imageUrl.match(regex);
    //     return match ? match[1] : null;
    // }

    async uploadAvatar(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                { folder: 'avatar_user' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                },
            );
            stream.write(file.buffer);
            stream.end();
        });
    }

    async deleteImageByUrl(imageUrl: string): Promise<boolean> {
        try {
            const publicIdMatch = imageUrl.split('/').pop();
            const publicId = publicIdMatch ? publicIdMatch.split('.')[0] : null;

            if (!publicId) {
                throw new BadRequestException('Invalid Cloudinary image URL.');
            }

            const result = await cloudinary.v2.uploader.destroy(publicId);

            if (result.result !== 'ok') {
                throw new BadRequestException('Failed to delete image from Cloudinary.');
            }

            return true;
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            return false;
        }
    }
}
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import cloudinary from '../config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'yoedu',
            },
            (error, result) => {
              if (error) {
                return reject(new Error(error.message || 'Upload thất bại'));
              }

              resolve(result);
            },
          )
          .end(file.buffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      throw new InternalServerErrorException(error || 'Upload thất bại');
    }
  }

  async removeImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error || 'Không thể xóa hình ảnh');
    }
  }
}

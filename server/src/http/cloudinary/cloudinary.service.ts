import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import ENVS from 'src/envs';
import { Stream } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: ENVS.CLOUDINARY_CLOUD_NAME,
      api_key: ENVS.CLOUDINARY_API_KEY,
      api_secret: ENVS.CLOUDINARY_API_SECRET,
    });
  }

  get cloudinary() {
    return v2;
  }

  async uploadImage(image: Stream): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { folder: 'CHATJS', format: 'webp' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );

      image.pipe(uploadStream);
    });
  }

  deleteImage(image_id: string) {
    v2.uploader.destroy(image_id, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Imagen eliminada:', result);
      }
    });
  }
}

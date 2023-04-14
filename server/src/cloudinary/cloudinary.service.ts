import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { Stream } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: 'dghx76ayc',
      api_key: '225494629144378',
      api_secret: 'lZF82E_glxSEbNJP_nVWIhXqdgE',
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
}

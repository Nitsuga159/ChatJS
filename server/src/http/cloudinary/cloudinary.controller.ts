import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { Readable } from 'stream';
import { UserMiddleware } from 'src/database/user-model/user-model.middleware';

@Controller('cloudinary')
@UseGuards(UserMiddleware)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('image', 3, {
      fileFilter: (_req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFiles() files): Promise<string[]> {
    try {
      const streams = files.map((file) => {
        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null);

        return stream;
      });

      const urls = await Promise.all(
        streams.map((stream) => this.cloudinaryService.uploadImage(stream)),
      );

      return urls;
    } catch (e: any) {
      throw new HttpException(
        `Error to upload images from cloudinary: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

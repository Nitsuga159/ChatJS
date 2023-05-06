import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { Readable } from 'stream';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('image'))
  async uploadFile(@UploadedFiles() files): Promise<string[]> {
    try {
      if (files.length > 3)
        throw new HttpException(
          'Limit exceeded, the maximum number of items is three',
          HttpStatus.BAD_REQUEST,
        );

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
        `Error to upload images from cloudinary:`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

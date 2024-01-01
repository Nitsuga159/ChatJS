import { HttpException, HttpStatus } from '@nestjs/common';
import ResponseType from 'src/interfaces/responseType';

export class DefaultHttpException extends HttpException {
  constructor(responseBody: ResponseType) {
    super(responseBody, responseBody.status);
  }
}
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMailCodeMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const mailToken = req.headers.authorization.split(' ').pop();

      const x = this.jwtService.verify(mailToken, {
        secret: String(process.env.JWT_SECRET_MAIL),
      });

      console.log('here the data: ', x);
    } catch (e: any) {
      throw new HttpException(
        'you need a token mail that approve that the code was verifed',
        HttpStatus.BAD_REQUEST,
      );
    }

    next();
  }
}

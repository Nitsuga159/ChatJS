import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtMailCodeMiddleware implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new HttpException('Invalid mail token', HttpStatus.UNAUTHORIZED);

    const token = authHeader.split(' ')[1];

    try {
      verify(token, String(process.env.JWT_SECRET_MAIL));
    } catch (e: any) {
      throw new HttpException('Invalid mail token', HttpStatus.NOT_ACCEPTABLE);
    }

    return true;
  }
}
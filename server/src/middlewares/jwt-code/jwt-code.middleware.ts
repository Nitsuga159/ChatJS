import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import ENVS from 'src/envs';

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
      verify(token, ENVS.JWT_MAIL_SECRET);
    } catch (e: any) {
      throw new HttpException('Invalid mail token', HttpStatus.NOT_ACCEPTABLE);
    }

    return true;
  }
}

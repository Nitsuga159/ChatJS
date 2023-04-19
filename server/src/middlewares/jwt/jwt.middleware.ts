import {
  Injectable,
  HttpException,
  HttpStatus,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    const token = authHeader.split(' ')[1];

    try {
      const user = verify(token, String(process.env.JWT_SECRET));

      req.user = user;
    } catch (e: any) {
      throw new HttpException('Invalid token', HttpStatus.NOT_ACCEPTABLE);
    }

    return true;
  }
}

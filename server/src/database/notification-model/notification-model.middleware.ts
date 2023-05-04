import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class NotificationMiddleware implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const notificationToken = req.query.notificationToken;

      if (!notificationToken) throw 'Invalid token';

      const notification: any = verify(
        notificationToken,
        String(process.env.JWT_NOTIFICATION_SECRET),
      );

      req.notification = notification;

      return true;
    } catch (e: any) {
      throw new HttpException(
        `Error with notification middleware: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

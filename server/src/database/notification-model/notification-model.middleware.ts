import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import ENVS from 'src/envs';
import { NotificationModelService } from './notification-model.service';

@Injectable()
export class NotificationMiddleware implements CanActivate {
  constructor(
    private readonly notificationModelService: NotificationModelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const notificationToken = req.query.notificationToken;

      if (!notificationToken) throw 'Invalid token';

      const notification: any = verify(
        notificationToken,
        ENVS.JWT_NOTIFICATION_SECRET,
      );

      await this.notificationModelService.delete(notification.id);

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

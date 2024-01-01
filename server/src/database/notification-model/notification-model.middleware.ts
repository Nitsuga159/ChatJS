import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { NotificationModelService } from './notification-model.service';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import { Types } from 'mongoose';

const { ObjectId } = Types

@Injectable()
export class NotificationMiddleware implements CanActivate {
  constructor(
    private readonly notificationModelService: NotificationModelService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();

      const removedNotification = 
        await this.notificationModelService.delete(new ObjectId(req.body.notificationId), new ObjectId(req.accessTokenPayload._id));

      if(!removedNotification) {
        throw 'Invalid notification'
      }

      req.body.invitationId = removedNotification.invitationId

      return true;
    } catch (e: any) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: `Error with notification middleware: ${e}` });
    }
  }
}

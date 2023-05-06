import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';
import {
  NotificationType,
  PROPS_NEW_NOTIFICATION,
  PROPS_READ_NOTIFICATION,
} from 'src/database/notification-model/notification-model.type';
import { NotificationDocument } from 'src/database/notification-model/notification-model';
import { Types } from 'mongoose';

@Controller('notification')
@UseGuards(UserMiddleware)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async find(
    @Req() req: any,
  ): Promise<{ continue: boolean; results: NotificationDocument[] }> {
    try {
      return await this.notificationService.find(req.user._id, req.query.page);
    } catch (e) {
      throw new HttpException(
        `Error to get user notifications: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('friend')
  @UseGuards(
    validateProps(PROPS_NEW_NOTIFICATION, 'query', true, 'notification'),
  )
  async friendNotification(@Req() req: any): Promise<boolean> {
    try {
      const destined = new Types.ObjectId(req.notification.destined);

      return await this.notificationService.create({
        destined,
        sender: req.user._id,
        type: NotificationType.FRIEND,
        invitationId: req.user._id,
      });
    } catch (e) {
      throw new HttpException(
        `Error to send friend notification: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('channel')
  @UseGuards(
    validateProps(PROPS_NEW_NOTIFICATION, 'query', true, 'notification'),
  )
  async channelNotification(
    @Req() req: any,
    @Query() query: { channelId: string },
  ): Promise<boolean> {
    try {
      const destined = new Types.ObjectId(req.notification.destined);

      return await this.notificationService.create({
        destined,
        sender: req.user._id,
        type: NotificationType.CHANNEL,
        invitationId: new Types.ObjectId(query.channelId),
      });
    } catch (e) {
      throw new HttpException(
        `Error to send channel notification: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('readed')
  @UseGuards(
    validateProps(PROPS_READ_NOTIFICATION, 'body', true, 'idsNotification'),
  )
  async readed(@Req() req: any): Promise<void> {
    try {
      await this.notificationService.readed(req.idsNotification, req.user._id);
    } catch (e) {
      throw new HttpException(
        `Error to read notifications: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

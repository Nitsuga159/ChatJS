import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { PROPS_NEW_NOTIFICATION } from '../../database/notification-model/notification-model.type';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';

@Controller('notification')
@UseGuards(UserMiddleware)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('create/:userId')
  @UseGuards(validateProps(PROPS_NEW_NOTIFICATION, 'body', true))
  async createNotification(@Param('userId') userId: string, @Req() req: any) {
    return await this.notificationService.createNotification(userId, req.data);
  }

  @Post('seen/:userId')
  @UseGuards(validateProps(PROPS_NEW_NOTIFICATION, 'body', true))
  async seenNotification(@Param('userId') userId: string, @Req() req: any) {
    return await this.notificationService.createNotification(userId, req.data);
  }
}

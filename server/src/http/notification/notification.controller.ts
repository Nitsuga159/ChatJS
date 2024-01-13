import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards, } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  NotificationType,
} from 'src/database/notification-model/notification-model.type';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import makeResponse from 'src/utils/makeResponse';
import { BodyNotificationChannel, BodyNotificationFriend, NotificationQuery, NotificationId } from './notification.body';

@Controller('notification')
@UseGuards(UserAccessTokenMiddleware)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  async find(@Req() req: any, @Query() query: NotificationQuery) {
    return makeResponse(
      await this.notificationService.find(
        req.accessTokenPayload._id,
        query
      ),
      HttpStatus.OK
    )
  }

  @Post('friend')
  @HttpCode(HttpStatus.CREATED)
  async friendNotification(@Req() { accessTokenPayload }: any, @Body() { destined }: BodyNotificationFriend) {
    await this.notificationService.createFriendNotification({
      destined,
      sender: accessTokenPayload._id,
      type: NotificationType.FRIEND,
      invitationId: accessTokenPayload._id
    });

    return makeResponse({ success: true }, HttpStatus.CREATED)
  }

  @Post('channel')
  @HttpCode(HttpStatus.CREATED)
  async channelNotification(@Req() { accessTokenPayload }: any, @Body() { destined, channelId }: BodyNotificationChannel) {
    await this.notificationService.createChannelNotification({
      destined,
      sender: accessTokenPayload._id,
      type: NotificationType.CHANNEL,
      invitationId: channelId
    });

    return makeResponse({ success: true }, HttpStatus.CREATED)
  }

  @Delete(':notificationId')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() { accessTokenPayload }: any, @Param() { notificationId }: NotificationId) {
    return makeResponse(
      await this.notificationService.delete(notificationId, accessTokenPayload._id),
      HttpStatus.OK
    )
  }
}

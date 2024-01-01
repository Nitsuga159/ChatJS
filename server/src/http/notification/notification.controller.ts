import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, UseGuards, } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  NotificationType,
} from 'src/database/notification-model/notification-model.type';
import bodyValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import makeResponse from 'src/utils/makeResponse';
import NOTIFICATION_MAP from './notification.body';

@Controller('notification')
@UseGuards(UserAccessTokenMiddleware)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  async find(@Req() req: any) {
    return makeResponse(
      await this.notificationService.find(
        req.accessTokenPayload._id,
        req.query.lastId,
        req._fields
      ),
      HttpStatus.OK
    )
  }

  @Post('friend')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(bodyValidationMiddleware(NOTIFICATION_MAP.FRIEND_NOTIFICATION))
  async friendNotification(@Req() { body, accessTokenPayload }: any) {
    await this.notificationService.createFriendNotification({
      destined: body.destined,
      sender: accessTokenPayload._id,
      type: NotificationType.FRIEND,
      invitationId: accessTokenPayload._id
    });

    return makeResponse({ success: true }, HttpStatus.CREATED)
  }

  @Post('channel')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(bodyValidationMiddleware(NOTIFICATION_MAP.CHANNEL_NOTIFICATION))
  async channelNotification(@Req() { body, accessTokenPayload }: any) {
    await this.notificationService.createChannelNotification({
      destined: body.destined,
      sender: accessTokenPayload._id,
      type: NotificationType.CHANNEL,
      invitationId: body.channelId
    });

    return makeResponse({ success: true }, HttpStatus.CREATED)
  }

  @Delete(':notificationId')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() { notficationId, accessTokenPayload }: any) {
    return makeResponse(
      await this.notificationService.delete(notficationId, accessTokenPayload._id),
      HttpStatus.OK
    )
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { NotificationDocument } from 'src/database/notification-model/notification-model';
import { NotificationModelService } from 'src/database/notification-model/notification-model.service';
import { PER_PAGE_NOTIFICATIONS, NotificationRequest } from 'src/database/notification-model/notification-model.type';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import { Ws } from 'src/ws/ws.gateway';

const { ObjectId } = Types;

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationModelService: NotificationModelService,
    private readonly channelModelService: ChannelModelService,
    private readonly friendModelService: FriendModelService,
    private readonly ws: Ws,
  ) {}
 
  async find(userId: string, lastId?: string, fields: {} = {}) {
    const userNotifications: NotificationDocument[] =
      await this.notificationModelService.find(new ObjectId(userId), lastId, fields);

    return {
      continue: userNotifications.length === PER_PAGE_NOTIFICATIONS,
      notifications: userNotifications,
    };
  }

  async findById(notificationId: string | Types.ObjectId) {
    notificationId = new ObjectId(notificationId.toString());

    const notificationDocument: NotificationDocument =
      await this.notificationModelService.findById(notificationId);

    if (!notificationDocument) throw 'Invalid notification id';

    return notificationDocument;
  }

  async createChannelNotification({ destined, sender, invitationId, type }: NotificationRequest) {
    const notificationExists = await this.notificationModelService.notificationExists({ sender, destined, invitationId, type })

    if(notificationExists) {
      throw new DefaultHttpException({ status: HttpStatus.CONFLICT, message: 'There is a notification with that data' })
    }

    const isNotMemberAndCheckAdmin = await this.channelModelService.isNotMemberAndCheckAdmin(
      { channelId: invitationId, adminId: sender, userId: destined }
    )

    if(!isNotMemberAndCheckAdmin) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Already member' })
    }

    const notification: NotificationDocument =
      await this.notificationModelService.create({ destined, sender, invitationId, type });

    return notification
  }

  async createFriendNotification({ destined, sender, invitationId, type }: NotificationRequest) {
    const notificationExists = await this.notificationModelService.notificationExists({ sender, destined, invitationId, type })

    if(notificationExists) {
      throw new DefaultHttpException({ status: HttpStatus.CONFLICT, message: 'There is a notification with that data' })
    }

    const isFriend = await this.friendModelService.isFriend({ userId: destined, friend: sender })

    if(isFriend) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Already friends' })
    }

    const notification: NotificationDocument =
      await this.notificationModelService.create({ destined, sender, invitationId, type });

    return notification
  }

  async readed(ids: (string | Types.ObjectId)[], destined: string | Types.ObjectId,) {
    await this.notificationModelService.readed(ids, destined);
  }

  async delete(notificationId: Types.ObjectId, userId: Types.ObjectId) {
    return await this.notificationModelService.delete(notificationId, userId)
  }
}

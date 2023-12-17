import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationDocument } from 'src/database/notification-model/notification-model';
import { NotificationModelService } from 'src/database/notification-model/notification-model.service';
import {
  PER_PAGE_NOTIFICATIONS,
  ToNotification,
} from 'src/database/notification-model/notification-model.type';
import { WS_USER } from 'src/ws/ws.events';
import { Ws } from 'src/ws/ws.gateway';

const ObjectId = Types.ObjectId;

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationModelService: NotificationModelService,
    private readonly ws: Ws,
  ) {}

  async find(
    userId: string | Types.ObjectId,
    lastId: string,
  ): Promise<{ continue: boolean; results: NotificationDocument[] }> {
    userId = new ObjectId(userId.toString());

    const userNotifications: NotificationDocument[] =
      await this.notificationModelService.find(userId, lastId);

    return {
      continue: userNotifications.length === PER_PAGE_NOTIFICATIONS,
      results: userNotifications,
    };
  }

  async findById(
    notificationId: string | Types.ObjectId,
  ): Promise<NotificationDocument> {
    notificationId = new ObjectId(notificationId.toString());

    const notificationDocument: NotificationDocument =
      await this.notificationModelService.findById(notificationId);

    if (!notificationDocument) throw 'Invalid notification id';

    return notificationDocument;
  }

  async create(toNotification: ToNotification): Promise<void> {
    const notification: NotificationDocument =
      await this.notificationModelService.create(toNotification);

    this.ws.emitToOne(
      toNotification.destined,
      WS_USER.NEW_NOTIFICATION,
      notification,
    );
  }

  async readed(
    ids: (string | Types.ObjectId)[],
    destined: string | Types.ObjectId,
  ): Promise<void> {
    await this.notificationModelService.readed(ids, destined);
  }

  async delete(notificationId: string, userId: Types.ObjectId): Promise<void> {
    await this.notificationModelService.delete(
      new Types.ObjectId(notificationId),
      userId,
    );
  }
}

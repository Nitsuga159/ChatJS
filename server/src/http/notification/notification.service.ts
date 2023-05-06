import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from 'src/database/notification-model/notification-model';
import { NotificationModelService } from 'src/database/notification-model/notification-model.service';
import { PER_PAGE_NOTIFICATIONS } from 'src/database/notification-model/notification-model.type';
import { Ws } from 'src/ws/ws.gateway';
import { sign } from 'jsonwebtoken';
import WS_EVENTS from 'src/ws/ws.type';
import ENVS from 'src/envs';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationModelService: NotificationModelService,
    private readonly ws: Ws,
  ) {}

  async find(
    userId: Types.ObjectId,
    page: string,
  ): Promise<{ continue: boolean; results: NotificationDocument[] }> {
    const currentPage = Number.parseInt(page);

    const userNotifications: NotificationDocument[] =
      await this.notificationModelService.find(
        userId,
        isNaN(currentPage) || currentPage < 1 ? 0 : currentPage - 1,
      );

    return {
      continue: userNotifications.length === PER_PAGE_NOTIFICATIONS,
      results: userNotifications,
    };
  }

  async findById(
    notificationId: Types.ObjectId,
  ): Promise<NotificationDocument> {
    const notificationDocument: NotificationDocument =
      await this.notificationModelService.findById(notificationId);

    if (!notificationDocument) throw 'Invalid notification id';

    return notificationDocument;
  }

  async create(
    data: any,
    toNotification: Omit<Notification, 'readed' | 'token'>,
  ): Promise<boolean> {
    const token = sign(data, ENVS.JWT_NOTIFICATION_SECRET);

    const notification: NotificationDocument =
      await this.notificationModelService.create({ ...toNotification, token });

    this.ws.emitToOne(
      toNotification.destined,
      WS_EVENTS.NEW_NOTIFICATION,
      notification,
    );

    return true;
  }

  async count(destined: Types.ObjectId): Promise<{ count: number }> {
    return await this.notificationModelService.count(destined);
  }

  async readed(ids: Types.ObjectId[], destined: Types.ObjectId): Promise<void> {
    await this.notificationModelService.readed(ids, destined);
  }
}

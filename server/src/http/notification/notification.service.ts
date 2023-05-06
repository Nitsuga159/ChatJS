import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationDocument } from 'src/database/notification-model/notification-model';
import { NotificationModelService } from 'src/database/notification-model/notification-model.service';
import {
  PER_PAGE_NOTIFICATIONS,
  ToNotification,
} from 'src/database/notification-model/notification-model.type';
import { Ws } from 'src/ws/ws.gateway';
import WS_EVENTS from 'src/ws/ws.type';

const ObjectId = Types.ObjectId;

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationModelService: NotificationModelService,
    private readonly ws: Ws,
  ) {}

  async find(
    userId: string | Types.ObjectId,
    page: string,
  ): Promise<{ continue: boolean; results: NotificationDocument[] }> {
    userId = new ObjectId(userId.toString());

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
    notificationId: string | Types.ObjectId,
  ): Promise<NotificationDocument> {
    notificationId = new ObjectId(notificationId.toString());

    const notificationDocument: NotificationDocument =
      await this.notificationModelService.findById(notificationId);

    if (!notificationDocument) throw 'Invalid notification id';

    return notificationDocument;
  }

  async create(toNotification: ToNotification): Promise<boolean> {
    const notification: NotificationDocument =
      await this.notificationModelService.create(toNotification);

    this.ws.emitToOne(
      toNotification.destined,
      WS_EVENTS.NEW_NOTIFICATION,
      notification,
    );

    return true;
  }

  async count(destined: string | Types.ObjectId): Promise<{ count: number }> {
    destined = new ObjectId(destined.toString());

    return await this.notificationModelService.count(destined);
  }

  async readed(
    ids: (string | Types.ObjectId)[],
    destined: string | Types.ObjectId,
  ): Promise<void> {
    await this.notificationModelService.readed(ids, destined);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  NewNotification,
  Notification,
} from '../../database/notification-model/notification-model';
import { SeenNotification } from '../../database/notification-model/notification-model.type';
import { Model, Types } from 'mongoose';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { Ws } from 'src/ws/ws.gateway';
import WS_EVENTS from 'src/ws/ws.type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly userService: UserModelService,
    private readonly ws: Ws,
  ) {}

  async createNotification(userId: string, { target, type }: NewNotification) {
    const foundedUser = await this.userService.findById(
      new Types.ObjectId(userId),
    );

    if (!foundedUser)
      throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);

    const notificationUser = await this.notificationModel.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId } },
      { upsert: true, new: true },
    );

    const length = notificationUser.notifications.push({ target, type });

    await notificationUser.save();

    const { notifications } = await notificationUser.populate(
      'notifications.target',
    );

    this.ws.emitToOne(
      userId,
      WS_EVENTS.NOTIFICATION,
      notifications[length - 1],
    );

    return true;
  }

  async seenNotification({}: SeenNotification) {}
}

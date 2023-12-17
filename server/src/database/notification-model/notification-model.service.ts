import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification-model';
import { NotificationType, ToNotification } from './notification-model.type';
import { PER_PAGE_MESSAGES } from '../types/message.type';

@Injectable()
export class NotificationModelService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async findById(id: Types.ObjectId): Promise<NotificationDocument> {
    return await this.notificationModel.findById(id, {
      __v: 0,
      readed: 0,
      invitationId: 0,
      destined: 0,
    });
  }

  async find(
    destined: Types.ObjectId,
    lastId: string,
  ): Promise<NotificationDocument[]> {
    let query = this.notificationModel
      .find({ destined }, { __v: 0, readed: 0, destined: 0 })
      .sort({ createdAt: 'desc' })
      .populate('sender', 'username photo color');

    if (lastId) {
      query = query.where('_id').gt(new Types.ObjectId(lastId) as any);
    }

    const notifications: NotificationDocument[] = await query
      .limit(PER_PAGE_MESSAGES)
      .exec();

    return notifications.map((notification) => notification.toObject());
  }

  async create(data: ToNotification): Promise<NotificationDocument> {
    let createdNotification = new this.notificationModel(data);
    createdNotification = (await createdNotification.save()).toObject();

    delete createdNotification.__v;
    delete createdNotification.destined;
    delete createdNotification.invitationId;

    return createdNotification;
  }

  async delete(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.notificationModel.findOneAndDelete({
      _id: notificationId,
      destined: userId,
    });
  }

  async readed(
    ids: (string | Types.ObjectId)[],
    destined: string | Types.ObjectId,
  ): Promise<void> {
    await this.notificationModel.updateMany(
      { _id: { $in: ids }, destined },
      { readed: true },
    );
  }
}

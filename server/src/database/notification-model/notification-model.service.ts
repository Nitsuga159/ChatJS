import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification-model';
import { NotificationType } from './notification-model.type';
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
    page: number,
  ): Promise<NotificationDocument[]> {
    const skip = page * PER_PAGE_MESSAGES;

    return await this.notificationModel
      .find({ destined }, { __v: 0, readed: 0, destined: 0, invitationId: 0 })
      .populate('sender', 'username photo color')
      .skip(skip)
      .limit(PER_PAGE_MESSAGES)
      .exec();
  }

  async create(
    data: Omit<Notification, 'readed'>,
  ): Promise<NotificationDocument> {
    let createdNotification = new this.notificationModel(data);
    createdNotification = (await createdNotification.save()).toObject();

    delete createdNotification.__v;
    delete createdNotification.destined;
    delete createdNotification.readed;
    delete createdNotification.invitationId;

    return createdNotification;
  }

  async delete(notificationId: Types.ObjectId): Promise<void> {
    await this.notificationModel.findByIdAndDelete(notificationId);
  }

  async count(destined: Types.ObjectId): Promise<{ count: number }> {
    return {
      count: await this.notificationModel.countDocuments({
        destined,
        readed: false,
      }),
    };
  }

  async readed(ids: Types.ObjectId[], destined: Types.ObjectId): Promise<void> {
    await this.notificationModel.updateMany(
      { _id: { $in: ids }, destined },
      { readed: true },
    );
  }
}

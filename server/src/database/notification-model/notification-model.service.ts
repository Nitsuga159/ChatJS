import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification-model';
import { NotificationType, NotificationRequest, PER_PAGE_NOTIFICATIONS } from './notification-model.type';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import queryFilter, { QueryFilterProps } from 'src/utils/queryFilter';
import { NotificationQuery } from 'src/http/notification/notification.body';

@Injectable()
export class NotificationModelService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async notificationExists({ sender, destined, invitationId, type }: NotificationRequest) {
    return await this.notificationModel.exists({ sender, destined, invitationId, type })
  }

  async exists(options) {
    return await this.notificationModel.exists(options)
  }

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
    queryProps: NotificationQuery
  ): Promise<NotificationDocument[]> {
    let query = this.notificationModel
      .find({ destined }, queryProps.fields)
      .populate('sender', 'username photo color');

    const notifications: NotificationDocument[] = 
      await queryFilter({ query, limit: PER_PAGE_NOTIFICATIONS, ...queryProps })

    return notifications.map((notification) => notification.toObject());
  }

  async create(data: NotificationRequest, fields: {} = {}): Promise<NotificationDocument> {
    const createdNotification = new this.notificationModel(data, fields);

    return (await createdNotification.save()).toObject();
  }

  async delete(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    const deletedNotification = await this.notificationModel.findOneAndDelete({
      _id: notificationId,
      destined: userId,
    }, { projection: { __v: 0 } })

    if(!deletedNotification) {
      throw new DefaultHttpException({ status: HttpStatus.NOT_FOUND, message: 'Notification doesn\'t exists' })
    }

    return deletedNotification.toObject()
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

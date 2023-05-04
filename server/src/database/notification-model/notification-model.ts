import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user-model/user-model';
import { NotificationType } from './notification-model.type';

export type NotificationDocument = Notification & Document;

@Schema()
export class NewNotification {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  target: string;

  @Prop({ enum: Object.values(NotificationType), required: true })
  type: NotificationType;

  @Prop({ type: Date, default: Date.now })
  date?: Date;

  @Prop({ type: Boolean, default: false })
  seen?: boolean;
}

export const NewNotificationSchema =
  SchemaFactory.createForClass(NewNotification);

@Schema()
export class Notification {
  @Prop({ type: Types.ObjectId, unique: true, ref: User.name, required: true })
  userId: string;

  @Prop({
    type: [NewNotificationSchema],
    default: [],
  })
  notifications: NewNotification[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

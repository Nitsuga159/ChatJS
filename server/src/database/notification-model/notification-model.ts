import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user-model/user-model';
import { NotificationType } from './notification-model.type';
import { sign } from 'jsonwebtoken';
import ENVS from 'src/envs';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  destined: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  invitationId: Types.ObjectId;

  @Prop({
    type: String,
    enum: NotificationType,
    required: true
  })
  type: NotificationType;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

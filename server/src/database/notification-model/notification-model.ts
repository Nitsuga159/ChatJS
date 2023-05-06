import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user-model/user-model';
import { NotificationType } from './notification-model.type';
import { sign } from 'jsonwebtoken';
import ENVS from 'src/envs';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  destined: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  invitationId: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType })
  type: NotificationType;

  @Prop({ type: Boolean, default: false })
  readed: boolean;

  get token(): string {
    return sign(
      { invitationId: this.invitationId, id: this._id, type: this.type },
      ENVS.JWT_NOTIFICATION_SECRET,
    );
  }
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

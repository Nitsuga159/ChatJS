import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.model';
import { Channel } from '../channel/channel.model';

export type UserChannelDocument = UserChannel & Document;

@Schema()
export class UserChannel {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: string;

  @Prop({ type: [Types.ObjectId], ref: Channel.name, required: true })
  channels: string[];
}

export const UserChannelSchema = SchemaFactory.createForClass(UserChannel);

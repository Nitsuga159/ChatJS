import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user-model/user-model';

export type FriendDocument = Friend & Document;

@Schema()
export class Friend {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user1: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user2: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  haveChat: boolean;

  @Prop({
    type: Map,
    of: Number,
    required: true,
  })
  messagesCount: Map<Types.ObjectId, number>;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

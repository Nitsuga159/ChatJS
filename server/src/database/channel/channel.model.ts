import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.model';

export type ChannelDocument = Channel & Document;

@Schema()
export class MessageGlobalModel {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: string;

  @Prop({
    required: true,
    validate: { validator: (v: string): boolean => v.length <= 2500 },
  })
  message: string;

  @Prop({ type: Date, default: Date.now, required: true })
  date: Date;
}

export const MessageGlobalSchema =
  SchemaFactory.createForClass(MessageGlobalModel);

@Schema()
export class Channel {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  admin: string;

  @Prop({ type: String, default: null })
  photo: string;

  @Prop({
    type: Map,
    of: [MessageGlobalSchema],
    validate: {
      validator: (v: Map<string, MessageGlobalModel>) => v.size <= 5,
      message: 'Only accepts a maximum of five chats',
    },
  })
  chat: Map<string, MessageGlobalModel>;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

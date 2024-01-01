import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user-model/user-model';
import { ChannelChatType, ChannelVoiceType } from './channel-model.type';

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
  @Prop({
    type: String,
    required: true,
    validators: { validate: (v: string) => v.length >= 5 && v.length <= 30 },
  })
  name: string;

  @Prop({
    type: String,
    validators: { validate: (v: string) => v.length <= 300 },
    default: '',
  })
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  admin: Types.ObjectId;

  @Prop({ type: String, default: null })
  photo: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: User.name, required: true }],
    default: [],
  })
  participants: Types.ObjectId[];

  @Prop({
    type: [
      {
        createdAt: { type: Date, default: Date.now() },
        name: {
          type: String,
          required: true,
          validate: { validator: (v: string) => v.length > 4 },
        },
        messagesCount: {
          type: Map,
          of: Number,
          required: true,
        },
      },
    ],
    validators: { validate: (v: ChannelChatType[]) => v.length <= 5 },
    default: [],
  })
  chats: ChannelChatType[];

  @Prop({
    type: [
      {
        createdAt: { type: Date, default: Date.now() },
        name: {
          type: String,
          required: true,
          validate: { validator: (v: string) => v.length > 4 },
        },
      },
    ],
    validators: { validate: (v: ChannelVoiceType[]) => v.length <= 5 },
    default: [],
  })
  voices: ChannelVoiceType[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
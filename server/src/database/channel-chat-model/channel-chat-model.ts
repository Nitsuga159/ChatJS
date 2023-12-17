import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/database/user-model/user-model';
import { Channel } from '../channel-model/channel.model';

type MessageType = {
  value: string;
  sender: string;
  photos: string[];
};

export type ChannelChatDocument = ChannelChat & Document;

@Schema({ timestamps: true })
export class ChannelChat {
  @Prop({ type: Types.ObjectId, required: true })
  chatId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Channel.name, required: true })
  channelId: Types.ObjectId;

  @Prop({ type: String, required: true })
  clientId: string;

  @Prop({
    type: {
      value: {
        type: String,
        validate: { validator: (v: string) => v.length <= 2500 },
      },
      photos: {
        type: [String],
        default: [],
        validate: { validator: (v: string[]) => v.length <= 3 },
      },
      sender: { type: Types.ObjectId, ref: User.name, required: true },
    },
    _id: false,
    required: true,
  })
  message: MessageType;
}

export const ChannelChatSchema = SchemaFactory.createForClass(ChannelChat);

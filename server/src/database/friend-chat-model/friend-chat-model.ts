import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/database/user-model/user-model';
import { Friend } from '../friend-model/friend-model';

type MessageType = {
  value: string;
  sender: string;
  meta: {
    createdAt: Date;
    readed: boolean;
  };
};

export type FriendChatDocument = FriendChat & Document;

@Schema({ timestamps: true })
export class FriendChat {
  @Prop({ type: Types.ObjectId, ref: Friend.name, required: true })
  friendId: Types.ObjectId;

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
      readed: {
        type: [
          {
            type: Types.ObjectId,
            ref: User.name,
            required: true,
          },
        ],
        default: [],
      },
    },
    _id: false,
    required: true,
  })
  message: MessageType;
}

export const FriendChatSchema = SchemaFactory.createForClass(FriendChat);

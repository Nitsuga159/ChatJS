import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.model';
import { Chat } from '../chat/chat.model';

export type UserChatDocument = UserChat & Document;

@Schema()
export class UserChat {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: string;

  @Prop({ type: [Types.ObjectId], ref: Chat.name, required: true })
  chats: string[];
}

export const UserChatSchema = SchemaFactory.createForClass(UserChat);

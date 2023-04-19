import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { Message } from './chat.type';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @IsString()
  @IsNotEmpty()
  userId1: User;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @IsString()
  @IsNotEmpty()
  userId2: User;

  @Prop({
    type: [
      {
        sender: { type: Types.ObjectId, ref: User.name, required: true },
        message: { type: String, required: true },
        date: { type: Date, default: Date.now(), required: true },
        photo: { type: [String], default: [] },
      },
    ],
    required: true,
  })
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

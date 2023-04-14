import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { IsNotEmpty, IsString } from 'class-validator';

@Schema()
export class Chat {
  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

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
      },
    ],
    required: true,
  })
  messages: { sender: string; message: string; date: Date }[];
}

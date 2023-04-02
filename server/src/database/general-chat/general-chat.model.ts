import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { User } from '../user/user.model';

export type GeneralChatDocument = GeneralChat & Document;

@Schema({ strict: 'throw' })
export class GeneralChat {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @IsString()
  @IsNotEmpty()
  userId: User;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  message: string;

  @Prop({ required: true })
  date: Date;
}

export const GeneralChatSchema = SchemaFactory.createForClass(GeneralChat);

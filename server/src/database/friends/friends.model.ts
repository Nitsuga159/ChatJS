import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.model';
import { Document, Types } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export type FriendsDocument = Friends & Document;

@Schema()
export class Friends {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @IsString()
  @IsNotEmpty()
  userOne: User;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @IsString()
  @IsNotEmpty()
  userTwo: User;
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);

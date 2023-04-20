import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.model';

export type UserToUserDocument = UserToUser & Document;

@Schema()
export class UserToUser {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: string;

  @Prop({ type: [Types.ObjectId], default: [], ref: User.name })
  users: string[];
}

export const UserToUserSchema = SchemaFactory.createForClass(UserToUser);

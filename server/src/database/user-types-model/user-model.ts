import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export type UserTypeDocument = UserType & Document;

@Schema()
export class UserType {
  @Prop({ unique: true, required: true })
  @IsString()
  type: string;
}

export const UserTypeSchema = SchemaFactory.createForClass(UserType);

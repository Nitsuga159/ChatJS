import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsInt, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  @IsString()
  name: string;

  @Prop()
  @IsInt()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

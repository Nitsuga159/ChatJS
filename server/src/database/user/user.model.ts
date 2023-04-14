import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Colors } from './user.type';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  @IsString()
  mail: string;

  @Prop({ unique: true, required: true })
  @IsString()
  username: string;

  @Prop({ unique: true })
  @IsString()
  password: string;

  @Prop({ required: true, default: true })
  habilited: boolean;

  @Prop()
  photo: string;

  @Prop({ enum: Object.values(Colors), default: Colors.BLUE })
  color: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

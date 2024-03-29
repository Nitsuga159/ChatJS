import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { UserType } from '../user-types-model/user-model';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  @IsString()
  mail: string;

  @Prop({ required: true })
  @IsString()
  username: string;

  @Prop({ required: true })
  @IsString()
  password: string;

  @Prop({ required: true, default: true })
  habilited: boolean;

  @Prop({
    default: null,
    validators: {
      validate: (v: string) => v.length <= 300,
    },
  })
  description: string;

  @Prop({ type: String, default: null })
  photo: string;

  @Prop({ type: Types.ObjectId, ref:  UserType.name, required: true })
  userType: Types.ObjectId;

  @Prop({
    type: String,
    validators: {
      validate: (v: string) => /^#([a-zA-Z0-9]{3}|[a-zA-Z0-9]{6})$/.test(v),
    },
    default: '#FFF',
  })
  color: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

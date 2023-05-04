import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user-model/user-model';

export type ChannelDocument = Channel & Document;

@Schema()
export class Channel {
  @Prop({
    type: String,
    required: true,
    validators: { validate: (v: string) => v.length >= 5 && v.length <= 100 },
  })
  name: string;

  @Prop({
    type: String,
    validators: { validate: (v: string) => v.length <= 300 },
  })
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  admin: Types.ObjectId;

  @Prop({ type: String, default: null })
  photo: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: User.name, required: true }],
    default: [],
  })
  participants: Types.ObjectId[];

  @Prop({
    type: Map,
    of: Types.ObjectId,
    validators: { validate: (v: Map<string, Types.ObjectId>) => v.size <= 5 },
    default: new Types.Map<string>(),
  })
  chats: Map<string, Types.ObjectId>;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

import { Types } from 'mongoose';

interface DefaultItem {
  name: string;
  createdAt?: Date;
}

export interface AddChatRequest { channelId: string, adminId: string, chatName: string }

export interface ChannelChatType extends DefaultItem {
  _id: Types.ObjectId;
  messagesCount: Map<Types.ObjectId, number>;
}

export interface ChannelVoiceType extends DefaultItem {
  _id: Types.ObjectId;
}

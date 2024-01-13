import { Types } from 'mongoose';

export interface ChatMessageData {
  channelId: Types.ObjectId;
  chatId: Types.ObjectId;
}

export interface MessageType {
  value: string;
  photos?: string[];
  sender: Types.ObjectId
}

export type SeenMessageType = { messageIds: string[]; userId: string };

export const PER_PAGE_MESSAGES: number = 30;

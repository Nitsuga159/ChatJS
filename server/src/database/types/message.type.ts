import { Types } from 'mongoose';

export type MessageType = {
  sender: Types.ObjectId;
  value: string;
  photos: string[];
};

export type SeenMessageType = { messageIds: string[]; userId: string };

export const PER_PAGE_MESSAGES: number = 10;
export const PROPS_READ_MESSAGES: string[] = ['ids'];
export const PROPS_DELETE_MESSAGES: string[] = ['ids'];
export const PROPS_NEW_MESSAGE: string[] = ['value', 'photos'];

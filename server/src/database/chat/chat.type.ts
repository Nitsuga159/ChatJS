export interface Message {
  sender: string;
  message: string;
  date: Date;
  photo?: string[];
}

export interface NewMessage extends Omit<Message, 'date'> {
  _id: string;
}

export interface ChatUser {
  _id: string;
  userId1: string;
  userId2: string;
}

export const PER_PAGE: number = 10;
export const PROPS_NEW_MESSAGE: string[] = ['_id', 'sender', 'message'];
export const PROPS_CHAT: string[] = ['userId1', 'userId2'];

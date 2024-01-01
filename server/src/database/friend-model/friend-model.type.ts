import { Types } from 'mongoose';
import { Friend, FriendDocument } from './friend-model';

export interface FriendType extends Friend {
  _id: Types.ObjectId;
}

export interface FriendDatabaseResponse {
  _id: Types.ObjectId;
  haveChat: boolean;
  messagesCount: number;
  friend: {
    _id: Types.ObjectId;
    username: string;
    color: string;
    photo: string | null;
  };
}


export const PER_EXTEND_PAGE_FRIEND: number = 300;

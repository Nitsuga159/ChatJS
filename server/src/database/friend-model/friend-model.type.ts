import { Types } from 'mongoose';
import { Friend, FriendDocument } from './friend-model';

export interface FriendType extends Friend {
  _id: Types.ObjectId;
}

export interface FriendResponse extends Pick<FriendDocument, '_id'> {
  friend: Types.ObjectId;
}

export const PER_PAGE_FRIEND: number = 35;
export const PER_EXTEND_PAGE_FRIEND: number = 300;

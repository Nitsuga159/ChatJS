import { Types } from 'mongoose';
import { Friend } from './friend-model';

export interface FriendType extends Friend {
  _id: Types.ObjectId;
}

export const PER_PAGE_FRIEND: number = 15;

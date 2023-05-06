import { Types } from 'mongoose';

type ObjectId = Types.ObjectId;

export enum NotificationType {
  FRIEND = 'FRIEND',
  CHANNEL = 'CHANNEL',
}

export type ToNotification = {
  sender: ObjectId;
  destined: ObjectId;
  invitationId: ObjectId;
  type: NotificationType;
};

export const PER_PAGE_NOTIFICATIONS = 15;
export const PROPS_READ_NOTIFICATION: string[] = ['ids'];
export const PROPS_NEW_NOTIFICATION: string[] = ['destined'];

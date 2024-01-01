import { Types } from 'mongoose';

type ObjectId = Types.ObjectId;

export enum NotificationType {
  FRIEND = 'FRIEND',
  CHANNEL = 'CHANNEL',
}

export interface NotificationRequest {
  sender: ObjectId;
  destined: ObjectId;
  invitationId: ObjectId;
  type: NotificationType;
};

export const PER_PAGE_NOTIFICATIONS = 5;
export const PROPS_READ_NOTIFICATION: string[] = ['ids'];
export const PROPS_NEW_NOTIFICATION: string[] = ['destined'];

export enum NotificationType {
  USER = 'USER',
  CHANNEL = 'CHANNEL',
}

export type SeenNotification = {
  userId: string;
  notificationsIds: string[];
};

export const PROPS_NEW_NOTIFICATION = ['target', 'type'];

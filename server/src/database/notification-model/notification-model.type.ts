export enum NotificationType {
  USER = 'USER',
  CHANNEL = 'CHANNEL',
}

export const PER_PAGE_NOTIFICATIONS = 15;
export const PROPS_READ_NOTIFICATION: string[] = ['ids'];
export const PROPS_NEW_NOTIFICATION: string[] = ['destined', 'type'];

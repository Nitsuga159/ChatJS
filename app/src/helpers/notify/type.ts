export enum NotifyType {
  WARNING,
  FAILURE,
  SUCCESS,
}

export interface NotificationType {
  notification: HTMLDivElement;
  timeout: NodeJS.Timeout;
}

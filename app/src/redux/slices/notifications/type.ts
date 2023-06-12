import { SimpleUser } from "@/types/user.type";

export enum NotificationType {
  FRIEND = "FRIEND",
  CHANNEL = "CHANNEL",
}

export interface Notification {
  _id: string;
  type: string;
  token: NotificationType;
  sender: SimpleUser;
}

export interface InitialStateNotification {
  lastId: string | null;
  continue: boolean;
  notifications: Notification[];
}

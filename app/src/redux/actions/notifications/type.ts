import { Notification } from "@/redux/slices/notifications/type";

//GET_NOTIFICATIONS
export interface RequestGetNotifications {
  lastId: string | null;
  accessToken: string;
}

export interface ResponseGetNotifications {
  continue: boolean;
  result: Notification[];
}

//CREATE_CHANNEL_NOTIFICATION
export interface RequestCreateChannelNotfication {
  channelId: string;
  destined: string;
  accessToken: string;
}

//CREATE_FRIEND_NOTIFICATION
export interface RequestCreateFriendNotfication {
  destined: string;
  accessToken: string;
}

//DELETE_NOTIFICATION
export interface RequestDeleteNotfication {
  notificationId: string;
  accessToken: string;
}

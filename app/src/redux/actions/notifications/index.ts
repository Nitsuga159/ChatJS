import getNotifications from "./getNofications";
import createChannelNotification from "./createChannelNotification";
import createFriendNotification from "./createFriendNotification";
import deleteNotification from "./deleteNotification";
import { actions } from "@/redux/slices/notifications";
import addTryCatch from "@/helpers/addTryCatch";

export const notificationActions = actions;

const notificationFetchs = {
  getNotifications,
  createChannelNotification,
  createFriendNotification,
  deleteNotification,
};

type NotificationFetchsKeys = keyof typeof notificationFetchs;

for (let key in notificationFetchs)
  notificationFetchs[key as NotificationFetchsKeys] = addTryCatch(
    notificationFetchs[key as NotificationFetchsKeys]
  ) as any;

export { notificationFetchs };

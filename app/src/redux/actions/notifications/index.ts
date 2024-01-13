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

export { notificationFetchs };

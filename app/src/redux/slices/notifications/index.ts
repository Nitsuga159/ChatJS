import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { InitialStateNotification } from "./type";
import { addChannelNotificationReducer } from "@/redux/actions/notifications/createChannelNotification";
import { addFriendNotificationReducer } from "@/redux/actions/notifications/createFriendNotification";
import { deleteNotificationReducer } from "@/redux/actions/notifications/deleteNotification";

const initialState: InitialStateNotification = {
  continue: true,
  lastId: null,
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addChannelNotification: addChannelNotificationReducer,
    addFriendNotification: addFriendNotificationReducer,
    deleteNotification: deleteNotificationReducer,
    reset(state) {
      state.continue = true;
      state.lastId = null;
      state.notifications = [];
    },
  },
});

export const getNotificationState = (state: RootState) => state.notifications;

export const { actions, reducer } = notificationSlice;

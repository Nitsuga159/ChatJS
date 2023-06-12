import utils from "@/utils";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  RequestCreateChannelNotfication,
  ResponseGetNotifications,
} from "./type";
import {
  InitialStateNotification,
  Notification,
} from "@/redux/slices/notifications/type";
import defaultError from "@/helpers/defaultError";
import { DefaultResponse } from "@/types/const.type";

const createChannelNotification = async ({
  channelId,
  destined,
  accessToken,
}: RequestCreateChannelNotfication): Promise<string> => {
  await axios.post(
    `/notification/channel?channelId=${channelId}&destined=${destined}`,
    {},
    utils.createHeaderToken(accessToken)
  );

  return "Invitation sent";
};

export const addChannelNotificationReducer = (
  state: InitialStateNotification,
  action: PayloadAction<Notification>
) => {
  state.notifications = [action.payload, ...state.notifications];
};

export default createChannelNotification;

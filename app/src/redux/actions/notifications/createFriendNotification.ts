import utils from "@/utils";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestCreateFriendNotfication } from "./type";
import {
  InitialStateNotification,
  Notification,
} from "@/redux/slices/notifications/type";
import defaultError from "@/helpers/defaultError";
import { DefaultResponse } from "@/types/const.type";

const createFriendNotification = async ({
  destined,
  accessToken,
}: RequestCreateFriendNotfication): Promise<string> => {
  await axios.post(
    `/notification/channel?destined=${destined}`,
    {},
    utils.createHeaderToken(accessToken)
  );

  return "Invitation sent";
};

export const addFriendNotificationReducer = (
  state: InitialStateNotification,
  action: PayloadAction<Notification>
) => {
  state.notifications = [action.payload, ...state.notifications];
};

export default createFriendNotification;

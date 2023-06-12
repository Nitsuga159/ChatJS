import utils from "@/utils";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestDeleteNotfication } from "./type";
import { InitialStateNotification } from "@/redux/slices/notifications/type";
import defaultError from "@/helpers/defaultError";
import { DefaultResponse } from "@/types/const.type";

const deleteNotification = async ({
  notificationId,
  accessToken,
}: RequestDeleteNotfication): Promise<boolean> => {
  await axios.delete(
    `/notification/${notificationId}`,
    utils.createHeaderToken(accessToken)
  );

  return true;
};

export const deleteNotificationReducer = (
  state: InitialStateNotification,
  action: PayloadAction<string>
) => {
  state.notifications = state.notifications.filter(
    ({ _id }) => _id !== action.payload
  );
};

export default deleteNotification;

import utils from "@/utils";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestGetNotifications, ResponseGetNotifications } from "./type";
import { InitialStateNotification } from "@/redux/slices/notifications/type";

const getNotifications = async ({
  lastId,
  accessToken,
}: RequestGetNotifications): Promise<ResponseGetNotifications> => {
  const { data } = await axios.get(
    `/notification${lastId || `?lastId=${lastId}`}`,
    utils.createHeaderToken(accessToken)
  );

  return data;
};

export const getNotificationsReducer = (
  state: InitialStateNotification,
  action: PayloadAction<ResponseGetNotifications>
) => {
  const { continue: canContinue, result } = action.payload;
  state.lastId = result[0]._id;
  state.continue = canContinue;
  state.notifications = [...state.notifications, ...result];
};

export default getNotifications;

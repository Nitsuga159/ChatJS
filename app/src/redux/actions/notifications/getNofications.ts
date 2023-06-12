import utils from "@/utils";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestGetNotifications, ResponseGetNotifications } from "./type";
import { InitialStateNotification } from "@/redux/slices/notifications/type";
import defaultError from "@/helpers/defaultError";

const getNotifications = async ({
  lastId,
  accessToken,
}: RequestGetNotifications): Promise<ResponseGetNotifications> => {
  const { data } = await axios.get(
    `/notification?lastId=${lastId || ""}`,
    utils.createHeaderToken(accessToken)
  );

  return data;
};

export const getNotificationsReducer = (
  state: InitialStateNotification,
  action: PayloadAction<ResponseGetNotifications>
) => {
  const { continue: canContinue, results } = action.payload;
  state.lastId = results[0]._id;
  state.continue = canContinue;
  state.notifications = [...state.notifications, ...results];
};

export default getNotifications;

import { PayloadAction } from "@reduxjs/toolkit";
import { RequestReadFriendMessages } from "./type";
import utils from "@/utils";
import axios from "axios";
import { InitialStateFriends } from "@/redux/slices/friend/type";
import defaultError from "@/helpers/defaultError";
import { DefaultResponse } from "@/types/const.type";

const resetMessageCount = async ({
  friendId,
  friendIndex,
  accessToken,
}: RequestReadFriendMessages): Promise<{ friendIndex: number }> => {
  await axios.post(
    `/friend-chat/read/${friendId}`,
    {},
    utils.createHeaderToken(accessToken)
  );

  return { friendIndex };
};

export const resetMessageCountReducer = (
  state: InitialStateFriends,
  action: PayloadAction<{ friendIndex: number }>
) => {
  const index = action.payload.friendIndex;
  state.friend.friends[index].messagesCount = 0;
};

export default resetMessageCount;

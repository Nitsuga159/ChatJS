import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import utils from "@/utils";
import { FriendMessage, InitialStateFriends } from "@/redux/slices/friend/type";
import { RequestAddFriendMessage, ResponseAddFriendMessage } from "./type";
import defaultError from "@/helpers/defaultError";
import { DefaultResponse } from "@/types/const.type";

const addMessage = async ({
  friendId,
  value,
  photos,
  accessToken,
}: RequestAddFriendMessage): Promise<boolean> => {
  await axios.post(
    `/friend-chat/message/${friendId}`,
    { value, photos },
    utils.createHeaderToken(accessToken)
  );

  return true;
};

export const addMessageReducer = (
  state: InitialStateFriends,
  action: PayloadAction<ResponseAddFriendMessage>
) => {
  const { friendId, message } = action.payload;
  const chat = state.chat.chats[friendId];
  state.chat.chats[friendId] = {
    ...chat,
    messages: [...chat.messages, message],
  };
};

export default addMessage;

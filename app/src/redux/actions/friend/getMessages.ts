import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  RequestGetFriendMessages,
  ResponseGetFriendMessage,
  SetGetFriendMessage,
} from "./type";
import { InitialStateFriends } from "@/redux/slices/friend/type";

const getMessages = async ({
  friendId,
  accessToken,
  lastId,
}: RequestGetFriendMessages) => {
  const { data }: { data: { status: number, results: { cotinue: boolean, friends: ResponseGetFriendMessage } } } =
    await axios.get(
      `/friend-chat/message/${friendId}${lastId ? `?lastId=${lastId}` : ''}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

  return data;
};

export const getMessageReducer = (
  state: InitialStateFriends,
  action: PayloadAction<SetGetFriendMessage>
) => {
  const { friendId, results, continue: canContinue } = action.payload;
  const messages = state.chat.chats[friendId]?.messages || [];

  state.chat.chats[friendId] = {
    continue: canContinue,
    lastId: results[0]?._id || null,
    messages: [...results, ...messages],
  };
};

export default getMessages;

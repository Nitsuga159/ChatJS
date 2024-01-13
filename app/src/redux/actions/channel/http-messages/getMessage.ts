import utils from "@/utils";
import axios from "axios";
import { InitialStateChannels } from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestGetChannelMessages, ResponseGetChannelMessages } from "./type";

const getMessages = async ({
  channelId,
  chatId,
  lastId,
  accessToken,
}: RequestGetChannelMessages): Promise<{ status: number, results: ResponseGetChannelMessages}> => {
  const { data } = await axios.get(
    `/channel-chat/message/${channelId}?chatId=${chatId}${lastId ? `&lastId=${lastId}` : ''}`,
    utils.createHeaderToken(accessToken)
  );

  return data;
};

export const getMessagesReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseGetChannelMessages>
) => {
  const { chatId, continue: canContinue, messages } = action.payload;
  const { chats } = state.chat;
  
  chats[chatId] = {
    continue: canContinue,
    lastId: messages[0]?._id || null,
    messages: chats[chatId]
      ? [...messages, ...chats[chatId].messages]
      : [...messages],
  };
};

export default getMessages;

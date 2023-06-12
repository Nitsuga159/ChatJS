import utils from "@/utils";
import axios from "axios";
import {
  ChannelMessage,
  InitialStateChannels,
} from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestAddChannelMessage } from "./type";

const addMessage = async ({
  chatId,
  channelId,
  clientId,
  message,
  accessToken,
}: RequestAddChannelMessage): Promise<void> => {
  await axios.post(
    `/channel-chat/message/${channelId}?chatId=${chatId}&clientId=${clientId}`,
    message,
    utils.createHeaderToken(accessToken)
  );
};

export const addMessageReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ChannelMessage>
) => {
  const { channelId, chatId } = action.payload;
  const { channelDetail } = state.channel;
  const { chats } = state.chat;

  if (chats[chatId])
    chats[chatId] = {
      ...chats[chatId],
      messages: [...chats[chatId].messages, action.payload],
    };

  if (channelDetail?._id === channelId) {
    const indexChat = channelDetail.chats.findIndex(
      ({ _id }) => chatId === _id
    );
    const chat = channelDetail.chats[indexChat];
    channelDetail.chats[indexChat] = {
      ...chat,
      messagesCount: chat.messagesCount + 1,
    };
  }
};

export default addMessage;

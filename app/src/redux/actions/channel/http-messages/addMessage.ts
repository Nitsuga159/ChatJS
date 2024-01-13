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
  message,
  accessToken,
}: RequestAddChannelMessage): Promise<void> => {
  await axios.post(
    '/channel-chat/message',
    { channelChatData: { channelId, chatId }, message },
    utils.createHeaderToken(accessToken),
  );
};

export const addMessageReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ChannelMessage>
) => {
  const message = action.payload;
  const { chatId } = message
  const { channelDetail } = state.channel;
  const { chats } = state.chat;

  console.log("message!", action.payload)

  if (chats[chatId]) {
    let messages = [...chats[chatId].messages, message];

    chats[chatId] = {
      ...chats[chatId],
      messages,
    };
  }

  // if (channelDetail?._id === channelId) {
  //   const indexChat = channelDetail.chats.findIndex(
  //     ({ _id }) => chatId === _id
  //   );
  //   const chat = channelDetail.chats[indexChat];
  //   channelDetail.chats[indexChat] = {
  //     ...chat,
  //     messagesCount: chat.messagesCount + 1,
  //   };
  // }
};

export default addMessage;

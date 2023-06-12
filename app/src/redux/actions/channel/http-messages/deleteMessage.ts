import utils from "@/utils";
import axios from "axios";
import {
  ChannelMessage,
  InitialStateChannels,
} from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  RequestDeleteChannelMessage,
  ResponseDeleteChannelMessage,
} from "./type";
import defaultError from "@/helpers/defaultError";
import { DefaultResponse } from "@/types/const.type";

const deleteMessages = async ({
  chatId,
  channelId,
  ids,
  accessToken,
}: RequestDeleteChannelMessage): Promise<string> => {
  await axios.delete(
    `/channel-chat/message/${channelId}?chatId=${chatId}&ids=${ids.join(",")}`,
    utils.createHeaderToken(accessToken)
  );

  return "Messages deleted";
};

export const deleteMessagesReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseDeleteChannelMessage>
) => {
  const { chatId, ids } = action.payload;
  const chat = state.chat.chats[chatId];

  if (chat) {
    const setIds = new Set(ids);
    chat.messages = chat.messages.filter(({ _id }) => !setIds.has(_id));
  }
};

export default deleteMessages;

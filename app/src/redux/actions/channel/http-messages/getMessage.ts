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
}: RequestGetChannelMessages): Promise<ResponseGetChannelMessages> => {
  const { data } = await axios.get(
    `/channel-chat/message/${channelId}?chatId=${chatId}&lastId=${
      lastId || ""
    }`,
    utils.createHeaderToken(accessToken)
  );

  return { ...data, channelId, chatId };
};

export const getMessagesReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseGetChannelMessages>
) => {
  const { chatId, continue: canContinue, results } = action.payload;
  const { chats } = state.chat;
  console.log("se llamo getMessages");
  chats[chatId] = {
    continue: canContinue,
    lastId: results[0]?._id || null,
    messages: chats[chatId]
      ? [...results, ...chats[chatId].messages]
      : [...results],
  };
};

export default getMessages;

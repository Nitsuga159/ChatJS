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

export default addMessage;

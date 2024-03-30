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

export default deleteMessages;

import utils from "@/utils";
import axios from "axios";
import {
  ChannelChat,
  InitialStateChannels,
  SimpleChannel,
} from "@/redux/slices/channel/type";
import {
  RequestAddChannelChat,
  ResponseAddChannelChat,
  ResponseAddParticipantToChannel,
} from "../type";
import { PayloadAction } from "@reduxjs/toolkit";

const addChat = async ({
  channelId,
  chatName,
  accessToken,
}: RequestAddChannelChat): Promise<boolean> => {
  await axios.post(
    `/channel/add-chat/${channelId}?chatName=${chatName}`,
    {},
    utils.createHeaderToken(accessToken)
  );

  return true;
};

export const addChatReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseAddChannelChat>
) => {
  const { channelId, chat } = action.payload;
  const { channelsDetail: channelDetail } = state;
  
  if (channelDetail?._id === channelId)
    channelDetail.chats = [...channelDetail.chats, chat];
};

export default addChat;

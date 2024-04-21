import { InitialStateChannels } from "@/redux/slices/channel/type";
import { ResponseAddChannelChat } from "../type";
import { PayloadAction } from "@reduxjs/toolkit";

export const addChatReducer = (
  state: InitialStateChannels,
  { payload: { channelId, chat } }: PayloadAction<ResponseAddChannelChat>
) => {
  const { channelsDetail } = state;

  const channel = channelsDetail[channelId]

  if(!channel) return state;

  channel.chats = [...channel.chats, chat]
};

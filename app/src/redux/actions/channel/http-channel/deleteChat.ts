import { PayloadAction } from "@reduxjs/toolkit";
import { InitialStateChannels } from "@/redux/slices/channel/type";
import { ResponseDeleteChatChannel } from "../type";

export const deleteChatReducer = (
  state: InitialStateChannels,
  { payload: { channelId, chatId } }: PayloadAction<ResponseDeleteChatChannel>
) => {
  const { channelsDetail } = state;

  const channel = channelsDetail[channelId]

  if(!channel) return state;

  channel.chats = channel.chats.filter(({ _id }) => _id !== chatId)

  return state
};

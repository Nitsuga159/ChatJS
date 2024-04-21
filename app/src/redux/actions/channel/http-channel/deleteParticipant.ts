import { PayloadAction } from "@reduxjs/toolkit";
import { InitialStateChannels } from "@/redux/slices/channel/type";
import { ResponseDeleteParticipant } from "../type";

export const deleteParticipantFromChannelReducer = (
  state: InitialStateChannels,
  { payload: { channelId, userId } }: PayloadAction<ResponseDeleteParticipant>
) => {
  const channel = state.channelsDetail[channelId]

  if(!channel) return state;

  channel.participants = channel.participants.filter(({ _id }) => _id !== userId)

  return state
};

export const deleteChannelFromParticipantReducer = (
  state: InitialStateChannels,
  { payload: { channelId } }: PayloadAction<Omit<ResponseDeleteParticipant, "userId">>
) => {
  if(!state.channelsDetail[channelId]) return;

  delete state.channelsDetail[channelId]

  state.currentChannelId = null

  return state
};

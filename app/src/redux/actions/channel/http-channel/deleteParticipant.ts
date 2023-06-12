import { PayloadAction } from "@reduxjs/toolkit";
import utils from "@/utils";
import axios from "axios";
import { InitialStateChannels } from "@/redux/slices/channel/type";
import { RequestDeleteParticipant, ResponseDeleteParticipant } from "../type";

const deleteParticipant = async ({
  channelId,
  userId,
  accessToken,
}: RequestDeleteParticipant): Promise<void> => {
  await axios.delete(
    `/channel/delete-participant/${channelId}?userId=${userId}`,
    utils.createHeaderToken(accessToken)
  );
};

export const deleteParticipantFromChannelReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseDeleteParticipant>
) => {
  const { channelId, userId } = action.payload;
  const { channelDetail } = state.channel;
  if (channelDetail?._id === channelId)
    channelDetail.participants = channelDetail.participants.filter(
      ({ _id }) => _id !== userId
    );
};

export const deleteChannelFromParticipantReducer = (
  state: InitialStateChannels,
  action: PayloadAction<Omit<ResponseDeleteParticipant, "userId">>
) => {
  const { channelId } = action.payload;
  const { channelDetail, channels } = state.channel;
  if (channelDetail?._id === channelId) state.channel.channelDetail = null;

  state.channel.channels = channels.filter(({ _id }) => _id !== channelId);
};

export default deleteParticipant;

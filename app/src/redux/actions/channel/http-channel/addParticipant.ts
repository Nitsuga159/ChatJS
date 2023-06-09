import utils from "@/utils";
import axios from "axios";
import {
  InitialStateChannels,
  SimpleChannel,
} from "@/redux/slices/channel/type";
import {
  RequestAddParticipant,
  ResponseAddParticipantToChannel,
} from "../type";
import { PayloadAction } from "@reduxjs/toolkit";

const addParticipant = async ({
  tokenNotification,
  accessToken,
}: RequestAddParticipant): Promise<void> => {
  await axios.post(
    `/channel/add-participant?tokenNotification=${tokenNotification}`,
    {},
    utils.createHeaderToken(accessToken)
  );
};

export const addParticipantToChannelReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseAddParticipantToChannel>
) => {
  const { channelId, user } = action.payload;
  const { channelDetail } = state.channel;
  if (channelDetail?._id === channelId)
    channelDetail.participants = [...channelDetail.participants, user];
};

export const addChannelToParticipantReducer = (
  state: InitialStateChannels,
  action: PayloadAction<SimpleChannel>
) => {
  const { channels } = state.channel;
  state.channel.channels = [...channels, action.payload];
};

export default addParticipant;

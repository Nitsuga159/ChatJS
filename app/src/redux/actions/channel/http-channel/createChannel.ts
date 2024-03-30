import { PayloadAction } from "@reduxjs/toolkit";
import utils from "@/utils";
import axios from "axios";
import {
  ChannelDetail,
  InitialStateChannels,
} from "@/redux/slices/channel/type";
import { RequestAddChannel } from "../type";

const createChannel = async (
  channelData: RequestAddChannel
): Promise<ChannelDetail> => {
  const { accessToken, ...channel } = channelData;

  const { data }: { data: ChannelDetail } = await axios.post(
    `/channel`,
    channel,
    utils.createHeaderToken(accessToken)
  );

  return data;
};

export const createChannelReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ChannelDetail>
) => {
  const channel = action.payload;

  const { _id, name, photo } = channel;

  state.channelsTabs = [{ _id, name, photo }, ...state.channelsTabs];
};

export default createChannel;

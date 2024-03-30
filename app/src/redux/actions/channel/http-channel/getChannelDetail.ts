import {
  ChannelDetail,
  DefaultRequestChannel,
  InitialStateChannels,
} from "@/redux/slices/channel/type";
import utils from "@/utils";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const getChannelDetail = async ({
  channelId,
  accessToken,
}: DefaultRequestChannel): Promise<{ status: number, results: ChannelDetail}> => {
  const { data } = await axios.get(
    `/channel/${channelId}`,
    utils.createHeaderToken(accessToken)
  );

  return data;
};

export const getChannelDetailReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ChannelDetail>
) => {
  console.log("channel detail", action.payload)
  
  state.channelsDetail[action.payload._id] = action.payload;
  state.currentChannelId = action.payload._id
};

export default getChannelDetail;

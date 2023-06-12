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
}: DefaultRequestChannel): Promise<ChannelDetail> => {
  const { data }: { data: ChannelDetail } = await axios.get(
    `/channel/${channelId}`,
    utils.createHeaderToken(accessToken)
  );

  return data;
};

export const getChannelDetailReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ChannelDetail>
) => {
  state.channel.channelDetail = action.payload;
};

export default getChannelDetail;

import { PayloadAction } from "@reduxjs/toolkit";
import utils from "@/utils";
import axios from "axios";
import { InitialStateChannels } from "@/redux/slices/channel/type";
import { RequestGetChannels, ResponseGetChannels } from "../type";

const getChannels = async ({
  lastId,
  accessToken,
}: RequestGetChannels): Promise<ResponseGetChannels> => {
  const { data }: { data: ResponseGetChannels } = await axios.get(
    `/channel?${lastId ? `lastId=${lastId}` : ""}`,
    utils.createHeaderToken(accessToken)
  );

  return data;
};

export const getChannelsReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseGetChannels>
) => {
  const { results, continue: canContinue } = action.payload;
  state.channel.lastId = results[results.length - 1]._id;
  state.channel.continue = canContinue;
  state.channel.channels = [...state.channel.channels, ...results];
};

export default getChannels;

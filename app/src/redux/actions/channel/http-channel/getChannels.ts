import { PayloadAction } from "@reduxjs/toolkit";
import utils from "@/utils";
import axios from "axios";
import { InitialStateChannels } from "@/redux/slices/channel/type";
import { RequestGetChannels, ResponseGetChannels, StartRequest } from "../type";
import { getFetch } from "@/utils/fetch";

let isFirstTime = true

const getChannels = async ({
  query,
  accessToken,
}: RequestGetChannels): Promise<{ status: number, results: ResponseGetChannels }> => {
  if(isFirstTime) {
    query.start = StartRequest.FIRST_ONE
    isFirstTime = false
  }

  return await getFetch({ 
    endpoint: '/channel/all', 
    query: {
      fields: '_id,name,photo',
      ...query
    },
    headers: utils.createHeaderToken(accessToken)
  })
};

export const getChannelsReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseGetChannels>
) => {
  console.log("new channels! ", action.payload.channels)

  const { channels, continue: canContinue } = action.payload;
  state.channel.continue = canContinue;
  state.channel.channels = [...state.channel.channels, ...channels];
};

export default getChannels;

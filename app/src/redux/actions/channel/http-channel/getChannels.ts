import { PayloadAction } from "@reduxjs/toolkit";
import utils from "@/utils";
import axios from "axios";
import { InitialStateChannels, SimpleChannel } from "@/redux/slices/channel/type";
import { RequestGetChannels, ResponseGetChannels, TimeRequest } from "../type";
import { getFetch } from "@/utils/fetch";

const getChannels = async ({
  query,
  accessToken,
}: RequestGetChannels): Promise<{ status: number, results: ResponseGetChannels }> => {
  return await getFetch({ 
    endpoint: '/channel/all', 
    query: {
      fields: '_id,name,photo,createdAt',
      ...query
    },
    headers: utils.createHeaderToken(accessToken)
  })
};

export default getChannels;

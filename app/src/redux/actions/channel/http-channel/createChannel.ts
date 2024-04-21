import { PayloadAction } from "@reduxjs/toolkit";

import {
  ChannelDetail,
  InitialStateChannels,
} from "@/redux/slices/channel/type";

export const createChannelReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ChannelDetail>
) => {
  const channel = action.payload;

  const { _id, name, photo } = channel;

  state.channelsTabs = [{ _id, name, photo }, ...state.channelsTabs];
};

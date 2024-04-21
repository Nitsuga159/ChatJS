import { ChannelDetail, InitialStateChannels } from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";

export const getChannelDetailReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ChannelDetail>
) => {
  state.channelsDetail[action.payload._id] = action.payload;
  state.currentChannelId = action.payload._id
};

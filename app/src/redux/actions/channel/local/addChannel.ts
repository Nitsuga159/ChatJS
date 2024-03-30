import {
  InitialStateChannels,
  SimpleChannel,
} from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";

export default (
  state: InitialStateChannels,
  action: PayloadAction<SimpleChannel>
) => {
  const channel = action.payload;

  state.channelsTabs = [channel, ...state.channelsTabs];
};

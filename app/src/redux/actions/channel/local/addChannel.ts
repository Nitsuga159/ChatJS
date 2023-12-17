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
  const channelState = state.channel;

  channelState.channels = [channel, ...channelState.channels];
};

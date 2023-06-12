import { InitialStateChannels } from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";

export default (state: InitialStateChannels, action: PayloadAction<string>) => {
  state.messagesToSend = state.messagesToSend.filter(
    ({ clientId }) => clientId !== action.payload
  );
};

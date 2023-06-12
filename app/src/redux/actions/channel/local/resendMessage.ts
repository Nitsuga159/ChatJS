import {
  EMessagesToSendStatus,
  InitialStateChannels,
} from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";

export default (state: InitialStateChannels, action: PayloadAction<string>) => {
  const index = state.messagesToSend.findIndex(
    ({ clientId }) => clientId === action.payload
  );

  if (index !== -1)
    state.messagesToSend[index].status = EMessagesToSendStatus.WAITING;
};

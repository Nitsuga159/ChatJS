import {
  EMessagesToSendStatus,
  InitialStateChannels,
} from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestAddChannelMessage } from "../http-messages/type";

export default (
  state: InitialStateChannels,
  action: PayloadAction<RequestAddChannelMessage>
) => {
  state.messagesToSend = [
    ...state.messagesToSend,
    { ...action.payload, status: EMessagesToSendStatus.WAITING },
  ];
};

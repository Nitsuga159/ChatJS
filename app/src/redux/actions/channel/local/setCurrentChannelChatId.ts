import { InitialStateChannels } from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";

export default (
  state: InitialStateChannels,
  action: PayloadAction<string | null>
) => {
  state.chat.currentChatId = action.payload;
};

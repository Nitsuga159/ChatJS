import { ChatMode, InitialStateSettings } from "@/redux/slices/settings/type";
import { PayloadAction } from "@reduxjs/toolkit";

export default (
  state: InitialStateSettings,
  action: PayloadAction<ChatMode>
) => {
  state.chatMode = action.payload;
};

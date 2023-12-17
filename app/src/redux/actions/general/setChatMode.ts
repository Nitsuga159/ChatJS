import { ChatMode, InitialStateGeneral } from "@/redux/slices/general/type";
import { PayloadAction } from "@reduxjs/toolkit";

export default (
  state: InitialStateGeneral,
  action: PayloadAction<ChatMode>
) => {
  state.chatMode = action.payload;
};

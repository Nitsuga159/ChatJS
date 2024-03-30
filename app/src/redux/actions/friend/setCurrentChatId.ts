import { InitialStateFriends } from "@/redux/slices/friend/type";
import { PayloadAction } from "@reduxjs/toolkit";

export const setCurrentChatId = (
  state: InitialStateFriends,
  action: PayloadAction<string | null>
) => {
  state.currentChatId = action.payload;
};

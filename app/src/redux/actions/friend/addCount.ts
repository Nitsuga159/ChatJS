import { InitialStateFriends } from "@/redux/slices/friend/type";
import { PayloadAction } from "@reduxjs/toolkit";

export const addCount = (
  state: InitialStateFriends,
  action: PayloadAction<number>
) => {
  state.friend.friends[action.payload].messagesCount++;
};

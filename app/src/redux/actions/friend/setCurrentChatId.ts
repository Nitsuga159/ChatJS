import { Friend, InitialStateFriends } from "@/redux/slices/friend/type";
import { PayloadAction } from "@reduxjs/toolkit";

export const setCurrentFriend = (
  state: InitialStateFriends,
  action: PayloadAction<Friend | null>
) => {
  state.currentFriend = action.payload;
};

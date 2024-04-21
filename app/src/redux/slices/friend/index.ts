import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { InitialStateFriends } from "./type";
import { setCurrentFriend } from "@/redux/actions/friend/setCurrentChatId";

const initialState: InitialStateFriends = {
  chats: {}, 
  currentFriend: null
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setCurrentFriend,
    reset(state) {
      state.chats = {}
      state.currentFriend = null
    },
  },
});

export const { actions, reducer } = friendSlice;

export const getFriendState = (state: RootState) => state.friend;

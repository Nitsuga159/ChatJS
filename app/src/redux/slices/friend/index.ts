import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { InitialStateFriends } from "./type";
import { addCount } from "@/redux/actions/friend/addCount";
import { setCurrentChatId } from "@/redux/actions/friend/setCurrentChatId";
import { addMessageReducer } from "@/redux/actions/friend/addMessage";
import { getMessageReducer } from "@/redux/actions/friend/getMessages";
import { getFriendsReducer } from "@/redux/actions/friend/getFriends";
import { resetMessageCountReducer } from "@/redux/actions/friend/resetMessageCount";
import { addFriendReducer } from "@/redux/actions/friend/addFriend";
import { deleteMessagesReducer } from "@/redux/actions/friend/deleteMessage";

const initialState: InitialStateFriends = {
  friend: { friends: [], lastId: null, continue: true },
  chat: { chats: {}, currentChatId: null },
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    getMessages: getMessageReducer,
    getFriends: getFriendsReducer,
    addFriend: addFriendReducer,
    addMessage: addMessageReducer,
    addCount,
    setCurrentChatId,
    deleteMessages: deleteMessagesReducer,
    resetMessageCount: resetMessageCountReducer,
    reset(state) {
      state.friend = { friends: [], lastId: null, continue: true };
      state.chat = { chats: {}, currentChatId: null };
    },
  },
});

export const { actions, reducer } = friendSlice;

export const getFriendState = (state: RootState) => state.friend.friend;
export const getFriendChatState = (state: RootState) => state.friend.chat;

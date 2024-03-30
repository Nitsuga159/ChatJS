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
  friends: [],
  chats: {}, 
  currentChatId: null
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
      state.friends = []
      state.chats = {}
      state.currentChatId = null
    },
  },
});

export const { actions, reducer } = friendSlice;

export const getFriendState = (state: RootState) => state.friend;

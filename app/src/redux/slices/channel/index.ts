import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { InitialStateChannels } from "./type";
import { getChannelsReducer } from "@/redux/actions/channel/http-channel/getChannels";
import { createChannelReducer } from "@/redux/actions/channel/http-channel/createChannel";
import { deleteChatReducer } from "@/redux/actions/channel/http-channel/deleteChat";
import {
  deleteChannelFromParticipantReducer,
  deleteParticipantFromChannelReducer,
} from "@/redux/actions/channel/http-channel/deleteParticipant";
import { getChannelDetailReducer } from "@/redux/actions/channel/http-channel/getChannelDetail";
import {
  addChannelToParticipantReducer,
  addParticipantToChannelReducer,
} from "@/redux/actions/channel/http-channel/addParticipant";
import { addChatReducer } from "@/redux/actions/channel/http-channel/addChat";
import { addMessageReducer } from "@/redux/actions/channel/http-messages/addMessage";
import { getMessagesReducer } from "@/redux/actions/channel/http-messages/getMessage";
import { deleteMessagesReducer } from "@/redux/actions/channel/http-messages/deleteMessage";
import setCurrentChannelChatId from "@/redux/actions/channel/local/setCurrentChannelChatId";
import addChannel from "@/redux/actions/channel/local/addChannel";
import checkLimitMessages from "@/redux/actions/channel/local/checkLimitMessages";

const initialState: InitialStateChannels = {
  channel: { channels: [], channelDetail: null, continue: true, lastId: null },
  chat: {
    chats: {},
    currentChatId: null,
  },
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    getMessages: getMessagesReducer,
    getChannels: getChannelsReducer,
    getChannelDetail: getChannelDetailReducer,
    createChannel: createChannelReducer,
    addChat: addChatReducer,
    addMessage: addMessageReducer,
    deleteMessages: deleteMessagesReducer,
    deleteChat: deleteChatReducer,
    deleteParticipantFromChannel: deleteParticipantFromChannelReducer,
    deleteChannelFromParticipant: deleteChannelFromParticipantReducer,
    addParticipantToChannel: addParticipantToChannelReducer,
    addChannelToParticipant: addChannelToParticipantReducer,
    setCurrentChannelChatId,
    addChannel,
    checkLimitMessages,
    reset(state) {
      state.channel = {
        channels: [],
        channelDetail: null,
        continue: true,
        lastId: null,
      };
      state.chat = {
        chats: {},
        currentChatId: null,
      };
    },
  },
});

export const { actions, reducer } = channelSlice;

export const getChannelState = (state: RootState) => state.channel.channel;
export const getChatChannelsState = (state: RootState) => state.channel.chat;

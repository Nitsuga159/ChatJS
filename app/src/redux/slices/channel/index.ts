import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { InitialStateChannels } from "./type";
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
import setCurrentChannelChatId from "@/redux/actions/channel/local/setCurrentChannelChatId";
import addChannel from "@/redux/actions/channel/local/addChannel";
import setCurrentChannelId from "@/redux/actions/channel/local/setCurrentChannelId";

const initialState: InitialStateChannels = {
  channelsDetail: {},
  currentChannelId: null,
  currentChatId: null,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    getChannelDetail: getChannelDetailReducer,
    createChannel: createChannelReducer,
    addChat: addChatReducer,
    deleteChat: deleteChatReducer,
    deleteParticipantFromChannel: deleteParticipantFromChannelReducer,
    deleteChannelFromParticipant: deleteChannelFromParticipantReducer,
    addParticipantToChannel: addParticipantToChannelReducer,
    addChannelToParticipant: addChannelToParticipantReducer,
    setCurrentChannelChatId,
    setCurrentChannelId,
    addChannel,
    reset(state) {
      state.channelsDetail = {}
      state.currentChatId =  null
    },
  },
});

export const { actions, reducer } = channelSlice;

export const getChannelState = (state: RootState) => state.channel;

import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { InitialStateGeneral, ChatMode } from "./type";
import setChatMode from "@/redux/actions/general/setChatMode";
import { LANGUAGE } from "@/languages/language-interface";

const initialState: InitialStateGeneral = {
  chatMode: ChatMode.FRIEND_CHAT,
  messagesToDelete: [],
  microphone: true,
  headphone: true,
  showProfile: false,
  language: LANGUAGE.EN
};

const channelSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setChatMode,
    toggleMicrophone(state) {
      state.microphone = !state.microphone;
    },
    toggleHeadphone(state) {
      state.headphone = !state.headphone;
    },
    toggleProfile(state) {
      state.showProfile = !state.showProfile;
    },
    reset(state) {
      state.showProfile = false;
      state.chatMode = ChatMode.FRIEND_CHAT;
    },
  },
});

export const { actions, reducer } = channelSlice;

export const getGeneralState = (state: RootState) => state.general;
export const getLanguage = (state: RootState) => state.general.language
export const getChatMode = (state: RootState) => state.general.chatMode;

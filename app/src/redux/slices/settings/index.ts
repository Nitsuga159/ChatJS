import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { InitialStateSettings, ChatMode } from "./type";
import setChatMode from "@/redux/actions/settings/setChatMode";

const initialState: InitialStateSettings = {
  chatMode: ChatMode.FRIEND_CHAT,
};

const channelSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setChatMode,
  },
});

export const { actions, reducer } = channelSlice;

export const getSettingsState = (state: RootState) => state.settings;
export const getChatMode = (state: RootState) => state.settings.chatMode;

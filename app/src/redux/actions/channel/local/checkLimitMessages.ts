import { InitialStateChannels } from "@/redux/slices/channel/type";
import { PayloadAction } from "@reduxjs/toolkit";

export default (state: InitialStateChannels, action: PayloadAction<string>) => {
  const chat = state.chat.chats[action.payload];
  if (chat && chat.messages.length > 60) {
    const newMessages = chat.messages.slice(
      chat.messages.length - 61,
      chat.messages.length - 1
    );
    chat.messages = newMessages;
    chat.continue = true;
    chat.lastId = chat.messages[0]._id || null;
  }
};

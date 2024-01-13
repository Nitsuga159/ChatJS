import { actions } from "@/redux/slices/channel";
import getChannels from "./http-channel/getChannels";
import createChannel from "./http-channel/createChannel";
import deleteChat from "./http-channel/deleteChat";
import addParticipant from "./http-channel/addParticipant";
import deleteParticipant from "./http-channel/deleteParticipant";
import getChannelDetail from "./http-channel/getChannelDetail";
import addChat from "./http-channel/addChat";
import addMessage from "./http-messages/addMessage";
import getMessages from "./http-messages/getMessage";
import deleteMessages from "./http-messages/deleteMessage";

export const channelActions = actions;

const channelFetchs = {
  getChannels,
  getChannelDetail,
  getMessages,
  addChat,
  addMessage,
  addParticipant,
  createChannel,
  deleteChat,
  deleteMessages,
  deleteParticipant,
};

export { channelFetchs };

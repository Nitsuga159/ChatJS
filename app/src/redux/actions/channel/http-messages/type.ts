import {
  ChannelMessage,
  DefaultRequestChannel,
} from "@/redux/slices/channel/type";

//GET_CHAT_CHANNEL_MESSAGES
export interface RequestGetChannelMessages extends DefaultRequestChannel {
  lastId: string | null;
  chatId: string;
}

export interface ResponseGetChannelMessages {
  chatId: string;
  continue: boolean;
  results: ChannelMessage[];
}

//ADD_CHAT_CHANNEL_MESSAGES

export interface RequestAddChannelMessage extends DefaultRequestChannel {
  clientId: string;
  chatId: string;
  message: { value?: string; photos?: string[] };
}

//DELETE_CHAT_CHANNEL_MESSAGE
export interface RequestDeleteChannelMessage extends DefaultRequestChannel {
  chatId: string;
  ids: string[];
}

export interface ResponseDeleteChannelMessage {
  chatId: string;
  ids: string[];
}

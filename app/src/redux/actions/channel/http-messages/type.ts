import {
  ChannelMessage,
  DefaultRequestChannel,
} from "@/redux/slices/channel/type";
import { DirectionRequest, TimeRequest } from "../type";

//GET_CHAT_CHANNEL_MESSAGES
export interface RequestGetChannelMessages extends DefaultRequestChannel {
  query: { chatId: string, to: DirectionRequest, time: TimeRequest,  lastId: string | null }
}

export interface ResponseGetChannelMessages {
  continue: boolean;
  messages: ChannelMessage[];
}

export interface PayloadGetChannelMessages extends Omit<ResponseGetChannelMessages, 'continue'> {
  chatId: string
}

//ADD_CHAT_CHANNEL_MESSAGES

export interface RequestAddChannelMessage extends DefaultRequestChannel {
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

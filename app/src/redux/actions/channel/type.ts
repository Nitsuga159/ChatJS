//GET_CHANNELS

import {
  SimpleChannelChat,
  DefaultRequestChannel,
  SimpleChannel,
} from "@/redux/slices/channel/type";
import { SimpleUser } from "@/types/user.type";

export enum TimeRequest {
  BEFORE = 'before',
  AFTER = 'after'
}

export enum DirectionRequest {
  DOWN = 'down',
  UP = 'up'
}


export interface RequestGetChannels {
  query: { lastId: string | null, time?: TimeRequest, to: DirectionRequest }
  accessToken: string;
}

export interface ResponseGetChannels {
  continue: boolean;
  channels: SimpleChannel[];
}

//ADD_CHANNEL

export interface RequestAddChannel
  extends Omit<DefaultRequestChannel, "channelId"> {
  name: string;
  description?: string;
  photo?: string;
}

//ADD_PARTICIPANT

export interface RequestAddParticipant
  extends Omit<DefaultRequestChannel, "channnelId"> {
  tokenNotification: string;
}

export interface ResponseAddParticipantToChannel {
  channelId: string;
  user: SimpleUser;
}

//ADD_CHAT_CHANNEL

export interface RequestAddChannelChat extends DefaultRequestChannel {
  chatName: string;
}

export interface ResponseAddChannelChat {
  channelId: string;
  chat: SimpleChannelChat;
}

//DELETE_CHAT_CHANNEL

export interface RequestDeleteChatChannel extends DefaultRequestChannel {
  chatId: string;
}

export interface ResponseDeleteChatChannel {
  chatId: string;
  channelId: string;
}

//DELETE_PARTICIPANT
export interface RequestDeleteParticipant extends DefaultRequestChannel {
  userId: string;
}

export interface ResponseDeleteParticipant {
  channelId: string;
  userId: string;
}

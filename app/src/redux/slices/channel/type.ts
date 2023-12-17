import { RequestAddChannelMessage } from "@/redux/actions/channel/http-messages/type";
import { Message } from "@/types/chat.type";
import { SimpleUser } from "@/types/user.type";

export interface DefaultRequestChannel {
  channelId: string;
  accessToken: string;
}

export interface SimpleChannel {
  _id: string;
  name: string;
  photo: string | null;
}

export interface SimpleChannelChat {
  _id: string;
  name: string;
  messagesCount: number;
}

export interface ChannelDetail extends SimpleChannel {
  description: string;
  admin: string;
  participants: SimpleUser[];
  chats: SimpleChannelChat[];
}

export interface ChannelMessage extends Message {
  chatId: string;
  channelId: string;
}

export interface ChannelChat {
  continue: boolean;
  lastId: string | null;
  messages: ChannelMessage[];
}

export enum EMessagesToSendStatus {
  WAITING,
  ERROR,
}

export interface IMessagesToSend extends RequestAddChannelMessage {
  status: EMessagesToSendStatus;
}

export interface InitialStateChannels {
  channel: {
    channels: SimpleChannel[];
    channelDetail: ChannelDetail | null;
    continue: boolean;
    lastId: string | null;
  };
  chat: {
    currentChatId: string | null;
    chats: {
      [key: string]: ChannelChat;
    };
  };
}

import { SettingsScroll } from "@/components/InfiniteScroll/type";
import { RequestAddChannelMessage } from "@/redux/actions/channel/http-messages/type";
import { TimeRequest } from "@/redux/actions/channel/type";
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

export enum EMessagesToSendStatus {
  WAITING,
  ERROR,
}

export interface IMessagesToSend extends RequestAddChannelMessage {
  status: EMessagesToSendStatus;
}

export interface InitialStateChannels {
  channelsTabs: SimpleChannel[];
  channelsDetail: { [key: string]: ChannelDetail };
  currentChannelId: string | null;
  currentChatId: string | null;
}

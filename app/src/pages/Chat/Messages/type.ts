import { ChannelChat, IMessagesToSend } from "@/redux/slices/channel/type";
import { FriendChat } from "@/redux/slices/friend/type";

export interface IMessagesProps {
  chat: ChannelChat | FriendChat;
  getMessages: () => Promise<void>;
  setMessage: (message: string, files: File[]) => void;
  deleteMessages: (ids: string[]) => void;
  resendMessage: (message: IMessagesToSend) => void;
}

import { MessageStatus } from "@/types/chat.type";

export interface NormalMessageProps {
  username?: string;
  value: string;
  color?: string;
  messagePhotos: string[];
  userPhoto?: string;
  createdAt: Date;
  refresh: () => void;
  status?: MessageStatus;
}

export interface MessageProps extends NormalMessageProps {
  id: string;
  senderId: string;
  isToDelete: boolean;
  haveMessagesToDelete: boolean;
}

export interface HeaderMessageProps extends MessageProps {
  color: string;
}

export interface SimpleMessageProps
  extends Omit<MessageProps, "username" | "color" | "userPhoto"> {}

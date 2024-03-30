import { MessageStatus } from "@/types/chat.type";

export enum MessageType {
  HEADER,
  NORMAL
}

export interface BasicMessageProps {
  type: MessageType
  username?: string
  value: string
  color?: string
  messagePhotos: string[]
  userPhoto?: string
  createdAt: Date
  isToDelete: boolean
}

export interface MessageProps extends BasicMessageProps {
  id: string;
  senderId: string;
  addToDelete: (id: string) => void,
  removeToDelete: (id: string) => void,
}

export interface HeaderMessageProps extends MessageProps {
  color: string;
}

export interface SimpleMessageProps
  extends Omit<MessageProps, "username" | "color" | "userPhoto"> {}

import { Message } from "@/types/chat.type";

export interface Friend {
  _id: string;
  haveChat: boolean;
  messagesCount: number;
  friend: {
    photo: string | null;
    username: string;
    color: string;
  };
}

export interface FriendMessage extends Message {
  friendId: string;
}

export interface FriendChat {
  continue: boolean;
  lastId: string | null;
  messages: FriendMessage[];
}

export interface InitialStateFriends {
  friend: { friends: Friend[]; lastId: string | null; continue: boolean };
  chat: { chats: { [key: string]: FriendChat }; currentChatId: string | null };
}

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

export interface FriendMessage {
  _id: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  message: {
    value: string;
    photos: string[];
    sender: {
      _id: string;
      username: string;
      color: string;
      photo?: string;
    };
  };
}

export interface FriendChat {
  continue: boolean;
  lastId: string;
  messages: FriendMessage[];
}

export interface InitialStateFriends {
  friend: { friends: Friend[]; lastId: string | null; continue: boolean };
  chat: { chats: { [key: string]: FriendChat }; currentChatId: string | null };
}

import { Friend, FriendMessage } from "@/redux/slices/friend/type";

interface DefaultRequestFriend {
  accessToken: string;
  friendId: string;
}

//GET_FRIEND

export interface RequestGetFriends
  extends Omit<DefaultRequestFriend, "friendId"> {
  lastId: string | null;
}

export interface ResponseGetFriends {
  friends: Friend[];
  continue: boolean;
}

//ADD_FRIEND

export interface RequestAddFriend
  extends Omit<DefaultRequestFriend, "friendId"> {
  tokenNotification: string;
}

//READ_MESSAGES

export interface RequestReadFriendMessages extends DefaultRequestFriend {
  friendIndex: number;
}

//GET_FRIEND_MESSAGES

export interface RequestGetFriendMessages extends DefaultRequestFriend {
  lastId: string | null;
}

export interface ResponseGetFriendMessage {
  continue: boolean;
  results: FriendMessage[];
}

export interface SetGetFriendMessage extends ResponseGetFriendMessage {
  friendId: string;
}

//ADD_FRIEND_MESSAGE

export interface RequestAddFriendMessage extends DefaultRequestFriend {
  clientId: string;
  value: string;
  photos?: string[];
}

export interface ResponseAddFriendMessage {
  friendId: string;
  message: FriendMessage;
}

//DELETE_FRIEND_MESSAGE
export interface RequestDeleteFriendMessage extends DefaultRequestFriend {
  ids: string[];
}

export interface ResponseDeleteFriendMessage {
  ids: string[];
  friendId: string;
}

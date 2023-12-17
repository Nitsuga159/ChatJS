export enum WS_CHANNEL {
  NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE',
  NEW_CHANNEL = 'NEW_CHANNEL',
  ADD_CHANNEL_CHAT = 'ADD_CHANNEL_CHAT',
  ADD_CHANNEL_PARTICIPANT = 'ADD_CHANNEL_PARTICIPANT',
  UPDATE_CHANNEL = 'UPDATE_CHANNEL',
  DELETE_CHANNEL_PARTICIPANT = 'DELETE_CHANNEL_PARTICIPANT',
  DELETE_CHANNEL_MESSAGE = 'DELETED_CHANNEL_MESSAGE',
  DELETE_CHANNEL_CHAT = 'DELETE_CHANNEL_CHAT',
}

export enum WS_FRIEND {
  NEW_FRIEND_MESSAGE = 'NEW_FRIEND_MESSAGE',
  NEW_FRIEND = 'NEW_FRIEND',
  ADD_FRIEND_CHAT = 'ADD_FRIEND_CHAT',
  DELETE_FRIEND_MESSAGE = 'DELETED_FRIEND_MESSAGE',
}

export enum WS_USER {
  USER_CONNECTION = 'USER_CONNECTION',
  USER_DISCONNECTION = 'USER_DISCONNECTION',
  NEW_NOTIFICATION = 'NEW_NOTIFICATION',
}

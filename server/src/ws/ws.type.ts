enum WS_EVENTS {
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_NOTIFICATION = 'NEW_NOTIFICATION',
  NEW_CHANNEL = 'NEW_CHANNEL',
  USER_CONNECTION = 'USER_CONNECTION',
  USER_DICONNECTION = 'USER_DICONNECTION',
  ADD_CHAT_CHANNEL = 'ADD_CHAT_CHANNEL',
  ADD_PARTICIPANT = 'ADD_PARTICIPANT',
  UPDATE_CHANNEL = 'UPDATE_CHANNEL',
  DELETE_PARTICIPANT = 'DELETE_PARTICIPANT',
  DELETED_MESSAGE = 'DELETED_MESSAGE',
  DELETE_CHAT_CHANNEL = 'DELETE_CHAT_CHANNEL',
}

export default WS_EVENTS;

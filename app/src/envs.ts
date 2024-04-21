const ENVS = {
  DEBUG: true,
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL,
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "http://localhost:3070",
  KEY_ID: "_id",
  CHAT_ITEMS_ID: "a539f70a-e700-4324-abf4-2b59e0c9bde5",
  CHANNEL_TABS_ITEMS_ID: "cad36e27-c6f6-41c5-b49e-6b0a9e29f979",
  FRIEND_TABS_ITEMS_ID: "799bbaea-47de-41b3-bebd-80a1cdd74e6f",
  SEARCH_USERS_ITEMS_ID: "bf5197c2-e72b-4721-9dfe-7978bc0f75c6",
  NOTIFICATION_ITEMS_ID: "9878fe66-d5ae-400c-be53-f495fc62c81a"
};

export default ENVS;

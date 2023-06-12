enum IPC {
  GET_USER_DEVICES = "GET_USER_DEVICES",
  GET_TOKEN = "GET_TOKEN",
  SET_TOKEN = "SET_TOKEN",
  MINIMIZE = "MINIMIZE",
  MAXIMIZE = "MAXIMIZE",
  FULLSCREEN = "FULLSCREEN",
  RESTORE = "RESTORE",
  CLOSE = "CLOSE",
}

export interface UserDevices {
  name: string;
  id: string;
  thumbnail: string;
}

export default IPC;

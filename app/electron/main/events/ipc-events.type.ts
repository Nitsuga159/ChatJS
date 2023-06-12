import { BrowserWindow } from "electron";
import Store from "electron-store";

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

export enum StoreKeys {
  TOKEN = "TOKEN",
}

export interface IpcMainProps {
  win: BrowserWindow;
  store: Store;
}

export interface UserDevices {
  name: string;
  id: string;
  thumbnail: string;
}

export default IPC;

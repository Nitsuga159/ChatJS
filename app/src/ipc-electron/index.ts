import { ipcRenderer } from "electron";
import IPC, { UserDevices } from "./ipc-events.type";

export const getUserDevices = async (): Promise<UserDevices[]> =>
  await ipcRenderer.invoke(IPC.GET_USER_DEVICES);

export const getUserToken = async (): Promise<string | null> =>
  await ipcRenderer.invoke(IPC.GET_TOKEN);

export const setUserToken = (token: string) =>
  ipcRenderer.send(IPC.SET_TOKEN, token);

export const setMinimizeWindow = () => ipcRenderer.send(IPC.MINIMIZE);
export const setRestoreWindow = () => ipcRenderer.send(IPC.RESTORE);
export const setFullscreenWindow = () => ipcRenderer.send(IPC.FULLSCREEN);
export const setCloseWindow = () => ipcRenderer.send(IPC.CLOSE);

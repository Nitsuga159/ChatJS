import { ipcMain } from "electron";
import getUserDevices from "./getUserDevices";
import IPC, { IpcMainProps, StoreKeys } from "./ipc-events.type";

const ipcMainEvents = ({ win, store }: IpcMainProps) => {
  ipcMain.handle(IPC.GET_USER_DEVICES, async () => await getUserDevices());

  //TOKEN AUTENTICATION
  ipcMain.handle(IPC.GET_TOKEN, async () => store.get(StoreKeys.TOKEN) || null);
  ipcMain.on(IPC.SET_TOKEN, (_, token: string) => {
    store.set(StoreKeys.TOKEN, token as string);
  });

  //TITLE BAR FUNCTIONABILITIES
  win.on("minimize", () => ipcMain.emit(IPC.MINIMIZE));
  win.on("unmaximize", () => ipcMain.emit(IPC.RESTORE));

  ipcMain.on(IPC.MINIMIZE, () => win.minimize());
  ipcMain.on(IPC.RESTORE, () => win.restore());
  ipcMain.on(IPC.FULLSCREEN, () => win.maximize());
  ipcMain.on(IPC.CLOSE, () => win.close());
};

export default ipcMainEvents;

import { desktopCapturer } from "electron";
import { UserDevices } from "./ipc-events.type";

export default async function getUserDevices(): Promise<UserDevices[]> {
  const sources = await desktopCapturer.getSources({
    types: ["screen", "window"],
  });

  return sources.map((source) => ({
    name: source.name,
    id: source.id,
    thumbnail: source.thumbnail.toDataURL(),
  }));
}

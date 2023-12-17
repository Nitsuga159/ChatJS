import { Socket, io } from "socket.io-client";

export function initSocket({
  url,
  accessToken,
}: {
  url: string;
  accessToken: string;
}): Socket {
  return io(url, { auth: { accessToken: `Bearer ${accessToken}` } });
}

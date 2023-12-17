import { ReactNode, createContext, useState } from "react"
import { Socket, io } from "socket.io-client";

export const SocketContext =
  createContext<{
    socket: Socket | null,
    activate: (url: string, accessToken: string) => void,
    disconnect: () => void
  }>({ socket: null, activate: () => { }, disconnect: () => { } });

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  const activate = (url: string, accessToken: string) => {
    setSocket(io(url, { auth: { accessToken: `Bearer ${accessToken}` } }));
  }

  const disconnect = () => {
    socket?.disconnect();
  }

  return (
    <SocketContext.Provider value={{ socket, activate, disconnect }}>
      {children}
    </SocketContext.Provider>
  )
}
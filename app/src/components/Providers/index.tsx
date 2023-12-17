import { ReactNode } from "react";
import { ShowOnAllScreenProvider } from "./ShowOnAllScreen";
import { ContextMenuProvider } from "./ContextMenu";
import SocketProvider from "./SocketIO";
import { GetProfileImageProvider } from "./GetProfileImage";

export default function AllProviders({ children }: { children: ReactNode }) {
  return (
    <SocketProvider>
      <ContextMenuProvider>
        <ShowOnAllScreenProvider>
          <GetProfileImageProvider>
            {children}
          </GetProfileImageProvider>
        </ShowOnAllScreenProvider>
      </ContextMenuProvider>
    </SocketProvider>
  )
}
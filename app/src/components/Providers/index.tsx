import { ReactNode } from "react";
import { ShowOnAllScreenProvider } from "./ShowOnAllScreen";
import { ContextMenuProvider } from "./ContextMenu";
import SocketProvider from "./SocketIO";
import { GetProfileImageProvider } from "./GetProfileImage";
import { HttpClientProvider } from "./http";

export default function AllProviders({ children }: { children: ReactNode }) {
  return (
    <HttpClientProvider>
      <SocketProvider>
        <ContextMenuProvider>
          <ShowOnAllScreenProvider>
            <GetProfileImageProvider>
              {children}
            </GetProfileImageProvider>
          </ShowOnAllScreenProvider>
        </ContextMenuProvider>
      </SocketProvider>
    </HttpClientProvider>
  )
}
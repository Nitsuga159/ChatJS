import { ReactNode, createContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShowContainer } from "./ShowOnAllScreen.styled";
import { SettingsType, ShowOnAllScreenType } from "./type";
import CSSAnimation from "@/components/CSSAnimation";
import { EAnimationStatus } from "@/components/CSSAnimation/type";

const ShowOnAllScreenContext =
  createContext<ShowOnAllScreenType>({ isOpen: false, showOnAllScreen: () => console.warn("ShowOnAllScreen: using default function") });

/* 
showOnAllScreen is a function that provides ShowOnAllScreenProvider.
when you call this function, you need to pass a callback that return a
JSX.Element that will be show it. Also, you can add a parameter in the callback.
That will be the status, if is open or not, a boolean:

showOnAllScreen(
  (isOpen: boolean) => 
  //you can implement an animation knowing the state with isOpen
  <p>Component to show!</p>
);
*/
function ShowOnAllScreenProvider({ children }: { children: ReactNode }) {
  const componentToShowRef = useRef<any>();
  const [settings, setSettings] =
    useState<SettingsType>({ open: false, component: () => <></> });

  const showOnAllScreen = (component: (isOpen: boolean) => JSX.Element) => {
    setSettings({ open: true, component })
  }

  const componentToShow = (status: EAnimationStatus) => (
    <ShowContainer
      status={status}
      onClick={(e) => {
        if (e.target === componentToShowRef.current)
          setSettings(prev => ({ ...prev, open: false }));
      }}
      ref={componentToShowRef}
    >
      {settings.component(settings.open)}
    </ShowContainer>
  )

  return (
    <ShowOnAllScreenContext.Provider value={{ isOpen: settings.open, showOnAllScreen }}>
      {children}
      <CSSAnimation open={settings.open} timeout={500}>
        {componentToShow}
      </CSSAnimation>
    </ShowOnAllScreenContext.Provider>
  )
}

export { ShowOnAllScreenProvider, ShowOnAllScreenContext };
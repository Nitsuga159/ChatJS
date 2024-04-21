import GetSize from "@/components/GetSize";
import * as S from "./ContextMenu.styled";
import { ContextMenuProps, MenuItemType, MenuSettingsType } from "./type";
import { useState, MouseEvent, useEffect, createContext, Fragment } from "react";

const ContextMenuContext = createContext<(e: MouseEvent<HTMLElement>, items: MenuItemType[]) => void>(() => { });

function ContextMenuProvider({ children }: ContextMenuProps) {
  const initialSettings = { open: false, top: 0, left: 0, height: 0, items: [], isUp: false };

  const [menuSettings, setMenuSettings] =
    useState<MenuSettingsType>(initialSettings);

  const { open, top, left, items, height } = menuSettings;

  const handleOpenContextMenu = (target: MouseEvent<HTMLElement>, items: MenuItemType[]) => {
    target.preventDefault();

    setMenuSettings((prev) => ({ ...prev, open: true, top: target.pageY, left: target.pageX, items }))
  }

  useEffect(() => {
    const closeContextMenu = () => setMenuSettings(initialSettings);

    document.addEventListener("click", closeContextMenu);

    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  return (
    <ContextMenuContext.Provider value={handleOpenContextMenu}>
      {children}
      <GetSize id="menu-context" callback={({height}) => setMenuSettings(prev => ({...prev, height }))}>
        <S.Menu id="menu-context" isUp={window.innerHeight / 2 < top} open={open} top={top} left={left} height={height}>
          {
            items.map(({ name, onSelect, icon, hasDivider, color }) => (
              <Fragment key={name}>
                <S.MenuItem color={color} onClick={() => onSelect(name)}>
                  <p>{name}</p>
                  {icon}
                </S.MenuItem>
                {hasDivider && <S.Divider />}
              </Fragment>
            ))
          }
        </S.Menu>
      </GetSize>
    </ContextMenuContext.Provider>
  );
}

export { ContextMenuProvider, ContextMenuContext }
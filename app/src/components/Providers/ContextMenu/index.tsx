import { Menu, MenuItem } from "./ContextMenu.styled";
import { ContextMenuProps, MenuItemType, MenuSettingsType } from "./type";
import { useState, MouseEvent, useEffect, createContext } from "react";

const ContextMenuContext = createContext<(e: MouseEvent<HTMLElement>, items: MenuItemType[]) => void>(() => { });

function ContextMenuProvider({ children }: ContextMenuProps) {
  const initialSettings = { open: false, top: 0, left: 0, items: [] };

  const [menuSettings, setMenuSettings] =
    useState<MenuSettingsType>(initialSettings);

  const { open, top, left, items } = menuSettings;

  const handleOpenContextMenu = (e: MouseEvent<HTMLElement>, items: MenuItemType[]) => {
    e.preventDefault();

    setMenuSettings({ open: true, top: e.pageY, left: e.pageX, items })
  }

  useEffect(() => {
    const closeContextMenu = () => setMenuSettings(initialSettings);

    document.addEventListener("click", closeContextMenu);

    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  return (
    <ContextMenuContext.Provider value={handleOpenContextMenu}>
      {children}
      <Menu open={open} top={top} left={left}>
        {
          items.map(({ name, onSelect, icon }, index) => (
            <MenuItem key={index} onClick={() => onSelect(name)}>{name} {icon}</MenuItem>
          ))
        }
      </Menu>
    </ContextMenuContext.Provider>
  );
}

export { ContextMenuProvider, ContextMenuContext }
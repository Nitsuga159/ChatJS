import { ReactNode } from "react";

export type MenuItemType = {
  name: string;
  icon?: JSX.Element;
  onSelect: (name: string) => void;
};

export type MenuSettingsType = {
  open: boolean;
  top: number;
  left: number;
  items: MenuItemType[];
};

export interface ContextMenuProps {
  children: ReactNode;
}

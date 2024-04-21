import { ReactNode } from "react";

export type MenuItemType = {
  name: string;
  color?: string
  hasDivider?: boolean 
  icon?: JSX.Element;
  onSelect: (name: string) => void;
};

export type MenuSettingsType = {
  isUp: boolean
  open: boolean;
  top: number;
  left: number;
  height: number;
  items: MenuItemType[];
};

export interface ContextMenuProps {
  children: ReactNode;
}

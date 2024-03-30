import { ReactNode } from "react";

export interface ItemSelectionProps {
  id?: string
  onClick: () => void;
  name: string;
  children: ReactNode;
}

export interface ILabelItem {
  show: boolean;
  top: number;
  left: number;
}

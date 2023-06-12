import { ReactNode, MouseEvent } from "react";

export interface ItemSelectionProps {
  onClick: () => void;
  name: string;
  children: ReactNode;
}

export interface ILabelItem {
  show: boolean;
  top: number;
  left: number;
}

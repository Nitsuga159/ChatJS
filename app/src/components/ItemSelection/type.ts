import { ReactNode } from "react";

export interface ItemSelectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  id?: string
  isSelected: boolean
  name: string;
  children: ReactNode;
}

export interface ILabelItem {
  show: boolean;
  top: number;
  left: number;
}

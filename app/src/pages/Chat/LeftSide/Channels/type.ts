import { MouseEvent } from "react";

export interface IMapItem {
  onClick: (id: string) => void;
  onMouseEnter: (e: MouseEvent<HTMLDivElement>, name: string) => void;
  onMouseLeave: () => void;
}

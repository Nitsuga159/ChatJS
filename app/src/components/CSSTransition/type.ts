export interface CSSTransitionProps {
  open: boolean;
  timeout: number;
  children: (state: TRANSITION_STATUS) => JSX.Element;
}

export enum TRANSITION_STATUS {
  IN = "in",
  OUT = "out",
  NONE = "none",
}

export interface CSSAnimationProps {
  open: boolean;
  timeout: number;
  children: (state: EAnimationStatus) => JSX.Element;
}

export enum EAnimationStatus {
  IN = "in",
  OUT = "out",
  NONE = "none",
}

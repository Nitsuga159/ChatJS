import { MutableRefObject } from "react";

export interface ScrollSpy {
  containerRef: MutableRefObject<HTMLElement | null>;
  atTop?: number;
  atBottom?: number;
  isAtBottom?: boolean;
  isAtTop?: boolean;
}

export enum RefreshType {
  DEFAULT,
  SCROLL,
}

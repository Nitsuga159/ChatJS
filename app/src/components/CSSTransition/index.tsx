import { useLayoutEffect, useState } from "react";
import { CSSTransitionProps, TRANSITION_STATUS } from "./type";

const CSSTransition = ({ open, timeout, children }: CSSTransitionProps) => {
  const [selector, setSelector] =
    useState<TRANSITION_STATUS>(TRANSITION_STATUS.NONE);

  useLayoutEffect(() => {
    if (open) {
      setSelector(TRANSITION_STATUS.IN);
    } else {
      setSelector(TRANSITION_STATUS.OUT);
      setTimeout(() => {
        setSelector(TRANSITION_STATUS.NONE);
      }, timeout);
    }
  }, [open, timeout]);

  return selector !== TRANSITION_STATUS.NONE ? children(selector) : null;
};



export default CSSTransition;
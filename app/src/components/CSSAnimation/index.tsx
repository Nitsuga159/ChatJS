import { useEffect, useState } from "react";
import { CSSAnimationProps, EAnimationStatus } from "./type";

const CSSAnimation = ({ open, timeout, children }: CSSAnimationProps) => {
  const [selector, setSelector] =
    useState<EAnimationStatus>(EAnimationStatus.NONE);

  useEffect(() => {
    if (open) {
      setSelector(EAnimationStatus.IN);
    } else if (selector !== EAnimationStatus.NONE) {
      setSelector(EAnimationStatus.OUT);
      setTimeout(() => {
        setSelector(EAnimationStatus.NONE);
      }, timeout);
    }
  }, [open, timeout, selector]);

  return selector !== EAnimationStatus.NONE ? children(selector) : null;
};



export default CSSAnimation;
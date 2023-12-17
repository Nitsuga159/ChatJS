import { useEffect, useRef, useState } from "react";
import { RefreshType, ScrollSpy } from "./type";

export default function useScrollSpy(
  { containerRef, atTop = 0, atBottom = 0, isAtBottom = false, isAtTop = false }:
    ScrollSpy
) {
  const [properties, setProperties] =
    useState({ isAtBottom, isAtTop, haveScroll: false });
  const scrollHeight = useRef<number>(0);

  const onScroll = () => {
    const { scrollHeight, clientHeight, scrollTop } = containerRef.current as HTMLElement;

    setProperties({
      isAtBottom: (scrollHeight - clientHeight - atBottom) <= scrollTop,
      isAtTop: scrollTop <= atTop,
      haveScroll: scrollHeight !== clientHeight
    })
  }

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    container.addEventListener('scroll', onScroll);

    return () => container.removeEventListener('scroll', onScroll)
  }, [containerRef.current]);

  const refresh = (type: RefreshType = RefreshType.DEFAULT) => {
    if (!containerRef.current) return;

    if (type === RefreshType.SCROLL) onScroll();
    else {

      const diff = containerRef.current.scrollHeight - scrollHeight.current;

      scrollHeight.current = containerRef.current.scrollHeight;

      containerRef.current.scrollTop += diff;
    }
  }

  return { ...properties, refresh }
}
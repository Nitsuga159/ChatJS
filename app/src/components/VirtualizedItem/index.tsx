import { ReactNode, useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function VirtualizedItem({ children, rootId }: { children: ((refresh: () => void) => ReactNode) | ReactNode, rootId?: string }) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [viewRef, isInView] = useInView({ rootMargin: '3000px 0px', root: rootId ? document.getElementById(rootId) : undefined, initialInView: true });

  const adjustSize = useCallback(() => {
    const current = itemRef.current;
    if (!current || !isInView) return;

    current.style.height = "auto";
    current.style.height = current.clientHeight + "px";
  }, [isInView]);

  useEffect(() => {
    window.addEventListener("resize", adjustSize);

    return () => window.removeEventListener("resize", adjustSize)
  }, [isInView, children]);

  useEffect(adjustSize, [isInView, children]);

  const childrenToRender = typeof children === 'function' ? children(adjustSize) : children;

  return (
    <div ref={(ref) => { viewRef(ref); itemRef.current = ref }}>
      {
        isInView ?
          <>{childrenToRender}</>
          : null
      }
    </div>
  );
}
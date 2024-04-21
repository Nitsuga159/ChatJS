import { useEffect, useRef, useState } from "react";

interface GetSizeProps {
  children: JSX.Element;
  callback: (size: { width: number, height: number }) => void;
  id?: string
}

export default function GetSize({ children, callback, id }: GetSizeProps) {
  const sizeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(id) {
      sizeRef.current = document.getElementById(id) as HTMLDivElement
    }
    if (!sizeRef.current) return;

    callback({ width: sizeRef.current?.clientWidth || 0, height: sizeRef.current?.clientHeight || 0 })

    const observer = new MutationObserver(() => {
      callback({ width: sizeRef.current?.clientWidth || 0, height: sizeRef.current?.clientHeight || 0 })
    })

    observer.observe(sizeRef.current, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, []);

  return id ?  children : <div ref={sizeRef}>{children}</div>;
}
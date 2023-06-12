import { useEffect, useRef, useState } from "react";

interface GetSizeProps {
  children: ((refresh: () => void) => JSX.Element) | JSX.Element;
  callback: (size: { width: number, height: number }) => void;
}

export default function GetSize({ children, callback }: GetSizeProps) {
  const sizeRef = useRef<HTMLDivElement | null>(null);
  const [gotSize, setGotSize] = useState<boolean>(false);

  useEffect(() => setGotSize(false), [children]);

  useEffect(() => {
    if (sizeRef.current && !gotSize) {
      const { width, height } = sizeRef.current.getBoundingClientRect();

      callback({ width, height });

      setGotSize(true);
    }
  }, [gotSize]);

  const childrenToRender = typeof children === 'function' ? children(() => setGotSize(false)) : children;

  return gotSize ? childrenToRender : <div ref={sizeRef}>{childrenToRender}</div>;
}
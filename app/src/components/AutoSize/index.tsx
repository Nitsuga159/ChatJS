import { useEffect, useRef, useState } from "react";

export default function AutoSize(
  { children }:
    { children: (dimension: { width: number, height: number }) => JSX.Element }
) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [gotSize, setGotSize] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    const resize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current?.getBoundingClientRect()
      setDimension({ width, height })
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (gotSize) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;

      const { width, height } = entries[0].contentRect;
      console.log(width, height)
      setDimension({ width, height });
      setGotSize(true)
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [gotSize]);


  return (

    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {children(dimension)}
    </div>
  );
};
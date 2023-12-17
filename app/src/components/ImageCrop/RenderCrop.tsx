import { useEffect, useRef } from "react";
import { IRenderCrop } from "./type";

export default function RenderCrop({ frame, giveRef }: IRenderCrop) {
  const [width, height] = frame;

  return <canvas ref={(el) => giveRef(el)} width={width} height={height} />

}
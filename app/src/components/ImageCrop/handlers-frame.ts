import { MouseEvent, SetStateAction } from "react";
import { IFrameCrop } from "./type";

export const handleMouseMoveOnFrame = (
  e: MouseEvent<HTMLDivElement>,
  frameRefs: IFrameCrop
) => {
  if (!frameRefs.isDragging || !frameRefs.frame) return;

  const { frame, lastX, lastY } = frameRefs;

  if (lastX && lastY) {
    const diffx = e.clientX - lastX;
    const diffy = e.clientY - lastY;

    const currentX = frameRefs.left + diffx;
    const currentY = frameRefs.top + diffy;

    frameRefs.left = currentX;
    frameRefs.top = currentY;
    frame.style.left = currentX + "px";
    frame.style.top = currentY + "px";
  }

  // ctx2.save();
  // ctx2.clearRect(0, 0, width, height);
  // ctx2.putImageData(imageData, 0, 0);
  // ctx2.restore();

  frameRefs.lastX = e.clientX;
  frameRefs.lastY = e.clientY;
};

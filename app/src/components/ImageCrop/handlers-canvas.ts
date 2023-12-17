import { MouseEvent } from "react";
import { drawImage } from "./handlers-image";
import { ICanvasCrop } from "./type";

export const handleMouseDownOnCanvas = (
  e: MouseEvent<HTMLCanvasElement>,
  canvasRefs: ICanvasCrop
) => {
  if (!canvasRefs.canvas) return;

  canvasRefs.isDragging = true;
  canvasRefs.startDragX = e.pageX - canvasRefs.canvas.offsetLeft;
  canvasRefs.startDragY = e.pageY - canvasRefs.canvas.offsetTop;
};

export const handleMouseUpOnCanvas = (
  e: MouseEvent<HTMLCanvasElement>,
  canvasRefs: ICanvasCrop
) => {
  if (!canvasRefs.canvas) return;

  canvasRefs.isDragging = false;
  canvasRefs.startDragX = e.pageX - canvasRefs.canvas.offsetLeft;
  canvasRefs.startDragY = e.pageY - canvasRefs.canvas.offsetTop;
};

export const handleMouseMoveOnCanvas = (
  e: MouseEvent<HTMLCanvasElement>,
  canvasRefs: ICanvasCrop
) => {
  const { ctx, canvas, image, isDragging, startDragX, startDragY } = canvasRefs;
  if (!ctx || !canvas || !image || !isDragging) return;

  const currentX = e.pageX - canvas.offsetLeft;
  const currentY = e.pageY - canvas.offsetTop;
  const deltaX = currentX - startDragX;
  const deltaY = currentY - startDragY;

  canvasRefs.offsetX += deltaX;
  canvasRefs.offsetY += deltaY;

  canvasRefs.startDragX = currentX;
  canvasRefs.startDragY = currentY;

  drawImage(canvasRefs);
};

export const handleWheelOnCanvas = (e: WheelEvent, canvasRefs: ICanvasCrop) => {
  e.preventDefault();
  const { ctx, canvas, image, offsetX, offsetY } = canvasRefs;
  if (!ctx || !canvas || !image) return;

  const zoomIntensity = 0.1;
  const zoomDelta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
  const zoomFactor = 1 + zoomDelta;

  canvasRefs.scaleFactor *= zoomFactor;

  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;

  canvasRefs.offsetX = (offsetX - mouseX) * zoomFactor + mouseX;
  canvasRefs.offsetY = (offsetY - mouseY) * zoomFactor + mouseY;

  drawImage(canvasRefs);
};

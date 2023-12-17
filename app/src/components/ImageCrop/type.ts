import { MutableRefObject } from "react";

export interface IImageCropProps {
  file: File;
  dimension: number[];
  frame: number[];
  renderRef: MutableRefObject<HTMLCanvasElement | null>;
}

export interface ICanvasCrop {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  image: HTMLImageElement | null;
  isDragging: boolean;
  startDragX: number;
  startDragY: number;
  scaleFactor: number;
  offsetX: number;
  offsetY: number;
}

export interface IFrameCrop {
  lastX: number;
  lastY: number;
  top: number;
  left: number;
  isDragging: boolean;
  frame: HTMLDivElement | null;
}

export interface IRenderCrop {
  frame: number[];
  giveRef: (canvas: HTMLCanvasElement | null) => void;
}

export const InitialCanvasRefs = () => ({
  canvas: null,
  ctx: null,
  image: null,
  isDragging: false,
  startDragX: 0,
  startDragY: 0,
  scaleFactor: 1,
  offsetX: 0,
  offsetY: 0,
});

export const InitialFrameRefs = () => ({
  lastX: 0,
  lastY: 0,
  top: 4,
  left: 4,
  isDragging: false,
  frame: null,
});

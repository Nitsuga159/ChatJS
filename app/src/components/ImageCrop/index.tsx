import { useEffect, useRef, useState, } from 'react';
import * as S from './ImageCrop.styled'
import { ICanvasCrop, IFrameCrop, IImageCropProps, InitialCanvasRefs, InitialFrameRefs } from './type';
import { adjustImageSize, drawImage, renderCrop } from './handlers-image';
import { handleMouseDownOnCanvas, handleMouseMoveOnCanvas, handleMouseUpOnCanvas, handleWheelOnCanvas } from './handlers-canvas';
import { handleMouseMoveOnFrame } from './handlers-frame';

export default function ImageCrop({ dimension, frame, file, renderRef }: IImageCropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageURL = useRef<string>(URL.createObjectURL(file));
  const { current: canvasRefs } = useRef<ICanvasCrop>(InitialCanvasRefs())
  const { current: frameRefs } = useRef<IFrameCrop>(InitialFrameRefs());

  useEffect(() => {
    if (!canvasRefs.canvas) return;
    const { canvas } = canvasRefs
    canvasRefs.ctx = canvas.getContext('2d', { willReadFrequently: true });

    let imageElement = new Image();

    imageElement.src = imageURL.current;

    canvasRefs.image = imageElement;

    imageElement.addEventListener("load", () => adjustImageSize(canvasRefs));

    const onWheel = (e: WheelEvent) => handleWheelOnCanvas(e, canvasRefs);

    canvas.addEventListener("wheel", onWheel)

    return () => {
      canvas.removeEventListener("wheel", onWheel)
    }
  }, [canvasRefs.canvas]);

  useEffect(() => {
    adjustImageSize(canvasRefs);
  }, [dimension]);

  return (
    <S.Container
      ref={containerRef}
      dimension={dimension}
      onMouseMove={(e) => {
        if (!canvasRefs.ctx || !renderRef.current) return;

        handleMouseMoveOnFrame(e, frameRefs);

        const imageData = canvasRefs.ctx.getImageData(frameRefs.left, frameRefs.top, frame[0], frame[1]);

        renderCrop(renderRef.current, imageData);
      }}
    >
      <S.Canvas
        ref={(el) => canvasRefs.canvas = el}
        onMouseDown={(e) => handleMouseDownOnCanvas(e, canvasRefs)}
        onMouseUp={(e) => handleMouseUpOnCanvas(e, canvasRefs)}
        onMouseMove={(e) => handleMouseMoveOnCanvas(e, canvasRefs)}
        width={dimension[0]}
        height={dimension[1]}
      />
      <S.Frame
        ref={el => frameRefs.frame = el}
        onMouseDown={(e) => {
          frameRefs.isDragging = true
        }}
        onMouseUp={() => {
          frameRefs.lastX = 0;
          frameRefs.lastY = 0;
          frameRefs.isDragging = false;
        }}
        frame={frame}
      >
        <S.FrameLeftTop />
        <S.FrameRightTop />
        <S.FrameLeftBottom />
        <S.FrameRightBottom />
      </S.Frame>
    </S.Container>
  );
}
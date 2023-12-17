import { ICanvasCrop } from "./type";

export const drawImage = (canvasRefs: ICanvasCrop) => {
  const { ctx, canvas, image, scaleFactor, offsetX, offsetY } = canvasRefs;
  if (!ctx || !canvas || !image) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const imageWidth = image.width * scaleFactor;
  const imageHeight = image.height * scaleFactor;

  const drawX = offsetX;
  const drawY = offsetY;

  ctx.drawImage(image, drawX, drawY, imageWidth, imageHeight);
};

export const adjustImageSize = (canvasRefs: ICanvasCrop) => {
  const { ctx, canvas, image } = canvasRefs;
  if (!ctx || !canvas || !image) return;

  if (image.width > canvas.width || image.height > canvas.height) {
    const widthRatio = canvas.width / image.width;
    const heightRatio = canvas.height / image.height;
    canvasRefs.scaleFactor = Math.min(widthRatio, heightRatio);
  } else {
    canvasRefs.scaleFactor = 1;
  }

  canvasRefs.offsetX =
    (canvas.width - image.width * canvasRefs.scaleFactor) / 2;
  canvasRefs.offsetY =
    (canvas.height - image.height * canvasRefs.scaleFactor) / 2;

  drawImage(canvasRefs);
};

export const renderCrop = (canvas: HTMLCanvasElement, imageData: ImageData) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.save();
  ctx.clearRect(0, 0, imageData.width, imageData.height);
  ctx.putImageData(imageData, 0, 0);
  ctx.restore();
};

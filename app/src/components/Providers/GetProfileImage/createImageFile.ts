export default (canvas: HTMLCanvasElement, fileName: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error());

      const file = new File([blob], fileName, { type: "image/png" });
      resolve(file);
    }, "image/png");
  });
};

export default (fileURL: string, name: string) => {
  const $anchor = document.createElement("a");
  $anchor.download = name;
  $anchor.href = fileURL;
  $anchor.click();
};

const getClipboardImage = (e: ClipboardEvent): File | null => {
  const items = e.clipboardData?.items;

  if (!items) return null;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.type.includes("image")) continue;

    e.preventDefault();

    const file = item.getAsFile();

    if (file) return file;
  }

  return null;
};

export default getClipboardImage;

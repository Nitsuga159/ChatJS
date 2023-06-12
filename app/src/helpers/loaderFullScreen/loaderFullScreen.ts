import CONST_ID from "@/types/const.type";
import loader from "./";

export const addLoader = (color: string, idElement: string = "main") => {
  removeLoader();

  const loaderHtml: HTMLDivElement = loader(color);

  document.getElementById(idElement)?.appendChild(loaderHtml);
};

export const removeLoader = () => {
  document.getElementById(CONST_ID.LOADER)?.remove();
};

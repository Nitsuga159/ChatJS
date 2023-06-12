import { Dispatch, SetStateAction } from "react";

export interface FilesContainerProps {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}

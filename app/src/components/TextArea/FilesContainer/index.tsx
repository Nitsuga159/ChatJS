import { useEffect, useState } from "react";
import { Container, FileItem, FileName, FileSubContainer, ImgFile, RemoveFileButton } from "./FilesContainer.styled";
import { FilesContainerProps } from "./type";

export default function FilesContainer({ files, setFiles }: FilesContainerProps) {
  const [imagesURL, setImagesURL] = useState<string[]>([]);

  const handleRemoveFile = (index: number) =>
    setFiles(files.filter((_, i) => i !== index))

  useEffect(() => {
    const imagesUrl = files.map(file => URL.createObjectURL(file))
    setImagesURL(imagesUrl);

    return () => {
      imagesURL.forEach(url => URL.revokeObjectURL(url))
    }
  }, [files]);

  return (
    <Container>
      {
        files.map((file, index) => (
          <FileItem key={index}>
            <FileSubContainer>
              <ImgFile src={imagesURL[index]} alt={file.name} />
            </FileSubContainer>
            <FileName>{file.name.length > 25 ? file.name.slice(0, 25) + '...' : file.name}</FileName>
            <RemoveFileButton onClick={() => handleRemoveFile(index)} />
          </FileItem>
        ))
      }
    </Container>
  );
}
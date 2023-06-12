import { Container, FileItem, FileName, FileSubContainer, ImgFile, RemoveFileButton } from "./FilesContainer.styled";
import { FilesContainerProps } from "./type";

export default function FilesContainer({ files, setFiles }: FilesContainerProps) {

  const handleRemoveFile = (index: number) =>
    setFiles(files.filter((_, i) => i !== index))

  return (
    <Container>
      {
        files.map((file, index) => (
          <FileItem key={index}>
            <FileSubContainer>
              <ImgFile src={URL.createObjectURL(file)} alt={file.name} />
            </FileSubContainer>
            <FileName>{file.name.length > 25 ? file.name.slice(0, 25) + '...' : file.name}</FileName>
            <RemoveFileButton onClick={() => handleRemoveFile(index)} />
          </FileItem>
        ))
      }
    </Container>
  );
}
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  ClipboardEvent
} from "react";
import { TextAreaProps } from "./type";
import { FileButton, Input, InputContainer, Container } from "./TextArea.styled";
import { FiPlusCircle } from 'react-icons/fi'
import { failureNotification } from "@/helpers/notify";
import FilesContainer from "./FilesContainer";
import getClipboardImage from "@/utils/getClipboardImage";



export default function TextArea({ onSendMessage, maxLength, maxAutoHeight = 200, file }: TextAreaProps) {
  const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
  const filesRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const [files, setFiles] = useState<File[]>([]);
  const [height, setHeight] = useState<number>(35);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!textAreaRef.current) return;

    updateAutoHeight(textAreaRef.current);
  }, [value, textAreaRef]);

  const handleChangeTextInput = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);

  const handleSendMessage = (e: any) => {
    if (!(e.key === "Enter" && !e.shiftKey)) return;

    e.preventDefault();

    onSendMessage(value, files);
    setValue("");
    setFiles([])
  }

  const updateAutoHeight = useCallback(($textArea: HTMLTextAreaElement) => {
    if ($textArea.scrollHeight < maxAutoHeight) {
      $textArea.style.height = "auto";
      $textArea.style.height = $textArea.scrollHeight + "px";
    }

    setHeight($textArea.scrollHeight);
  }, [height, maxAutoHeight]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files![0];

    (event.target.value as any) = null

    if (!selectedFile) return;

    const maxSize = file!.maxSizeFile * 1024 * 1024;

    if (selectedFile.size > maxSize) return failureNotification("file size excedeed 3MB");

    setFiles(prevFiles => [...prevFiles, selectedFile]);
  }, [files]);

  const handlePasteClipboard = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const file = getClipboardImage(e as any);

    if (file && files.length < 3) setFiles(prevFiles => [...prevFiles, file])
  }

  return (
    <Container>
      {
        files.length !== 0 &&
        <FilesContainer files={files} setFiles={setFiles} />
      }
      <InputContainer>
        {
          file &&
          <FileButton
            onClick={
              () =>
                files.length < 3 ? filesRef.current?.click() : failureNotification("only accept 3 files")
            }
          >
            <FiPlusCircle style={{ fontSize: 20 }} />
            <input
              ref={filesRef}
              onChange={handleFileChange}
              type="file"
              accept={file.accept}
              hidden
            />
          </FileButton>
        }
        <Input
          ref={textAreaRef}
          height={height}
          maxAutoHeight={maxAutoHeight}
          rows={1}
          onKeyDown={handleSendMessage}
          onChange={handleChangeTextInput}
          placeholder="Send message"
          value={value}
          maxLength={maxLength}
          onPaste={handlePasteClipboard}
          spellCheck={false}
        />
      </InputContainer>
    </Container>
  );
}
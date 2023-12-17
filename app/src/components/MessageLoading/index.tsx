import { EMessagesToSendStatus } from "@/redux/slices/channel/type";
import { LoadingMessageContainer, LoadingMessageImage, LoadingMessageValue } from "./MessageLoading.styled";
import { IoReloadCircleSharp } from 'react-icons/io5'
import { BsCardImage } from "react-icons/bs";

export default function LoadingMessage({ value, havePhotos, status, resendMessage }: { value: string; havePhotos: boolean, status: EMessagesToSendStatus, resendMessage: () => void }) {
  return (
    <LoadingMessageContainer status={status}>
      {havePhotos && <BsCardImage style={{ fontSize: '1.2rem' }} />}
      {status === EMessagesToSendStatus.ERROR && <LoadingMessageImage onClick={resendMessage} />}
      <LoadingMessageValue>{value}</LoadingMessageValue>
    </LoadingMessageContainer>
  );
}
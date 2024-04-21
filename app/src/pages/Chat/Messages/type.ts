import { DefaultAPI } from "@/components/Providers/http/api-interface";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";

export interface IMessagesProps {
  scrollItemsKey: string
  api: DefaultAPI
  deleteMessages: (ids: string[]) => void
  setMessage: (message: string, files: File[]) => void;
  giveRef?: (ref: HTMLElement | null) => void;
}

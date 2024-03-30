import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";

export interface IMessagesProps {
  scrollItemsKey: string
  deleteMessages: (ids: string[]) => void
  getMessages: (time: TimeRequest, to: DirectionRequest, lastId: string) => Promise<{ continue: boolean, newItems: any[] } | undefined>
  setMessage: (message: string, files: File[]) => void;
  giveRef?: (ref: HTMLElement | null) => void;
}

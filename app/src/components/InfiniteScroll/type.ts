import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";
import { DefaultAPI } from "../Providers/http/api-interface";

export interface InfiniteScrollProps {
  id?: string;
  scrollItemsKey: string
  loading: JSX.Element;
  margin?: number;
  className?: string;
  startFrom: DirectionRequest
  maxItems?: number
  maxVirtualItems?: number
  giveRef?: (ref: HTMLElement | null) => void;
  renderItem: (data: any, index: number, context: any[]) => JSX.Element;
  api: DefaultAPI
}

export interface IRefsInfiniteScroll {
  infiniteScrollRef: HTMLDivElement | null;
  scrollItemsKey?: string
  lastItemId?: string;
  timeout: number;
  functionId: NodeJS.Timeout | null;
}

export interface SettingsScroll {
  isFetching?: boolean
  startFrom?: DirectionRequest
  directionTime?: TimeRequest
  isAtTop?: boolean
  isAtBottom?: boolean
  continueBefore?: boolean
  continueAfter?: boolean
  scrollTop?: number
} 
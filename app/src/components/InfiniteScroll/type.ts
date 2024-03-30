import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";

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
  fetchItems: (time: TimeRequest, to: DirectionRequest, lastId: string) => Promise<{ continue: boolean, newItems: any[] } | undefined>;
}

export interface IRefsInfiniteScroll {
  infiniteScrollRef: HTMLDivElement | null;
  lastScrolls: { [key: string]: number };
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
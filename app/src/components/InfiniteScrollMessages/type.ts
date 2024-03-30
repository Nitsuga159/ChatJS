import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";

export interface InfiniteScrollProps {
  id?: string;
  resetCb?: (cb: () => void) => void;
  items: any[];
  renderItem: (data: any, index: number, context: any[]) => JSX.Element;
  fetchItems: (time: TimeRequest, to: DirectionRequest) => Promise<{ continue: boolean, newItems: any[] } | undefined>;
  updateItems: (data: any[]) => void;
  setItemFromSocket?: (cb: (data: any) => void) => void;
  loading: JSX.Element;
  limit: number;
  margin?: number;
  className?: string;
  settings: SettingsScroll
  setSettings: React.Dispatch<React.SetStateAction<SettingsScroll>>
  giveRef?: (ref: HTMLElement | null) => void;
  scrollItemsKey: string
}

export interface IRefsInfiniteScroll {
  infiniteScrollRef: HTMLDivElement | null;
  lastScroll: number;
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
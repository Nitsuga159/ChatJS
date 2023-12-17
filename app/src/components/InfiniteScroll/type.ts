export interface InfiniteScrollProps {
  id?: string;
  size?: { height: number; width: number };
  resetCb?: (cb: () => void) => void;
  itemsLength: number;
  renderItem: (index: number) => JSX.Element;
  fetchItems: () => Promise<void>;
  loading: JSX.Element;
  hasMore: boolean;
  margin?: number;
  className?: string;
  up?: true;
  ref?: (ref: HTMLElement | null) => void;
}

export interface IRefsInfiniteScroll {
  infiniteScrollRef: HTMLDivElement | null;
  prevScrollHeight: number;
  isSearching: boolean;
  isAtBottom: boolean;
  isAtTop: boolean;
  itemsCount: number;
  haveScroll: boolean;
}

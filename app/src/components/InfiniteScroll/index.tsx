import { useCallback, UIEvent, useEffect, useRef, useState } from "react";
import GetSize from "../GetSize";
import { IRefsInfiniteScroll, InfiniteScrollProps } from "./type";
import calculateDiference from "./calculateDifference";

export default function InfiniteScroll(
  { id, resetCb, size, ref, itemsLength, renderItem, fetchItems, margin = 0, loading, hasMore, up, className }:
    InfiniteScrollProps
) {
  const { current: refs } = useRef<IRefsInfiniteScroll>({
    infiniteScrollRef: null,
    itemsCount: -Infinity,
    prevScrollHeight: 0,
    isSearching: false,
    haveScroll: false,
    isAtTop: !up ? true : false,
    isAtBottom: up ? true : false
  });
  const [loadingHeight, setLoadingHeight] = useState<number>(0);

  const check = async () => {
    if (refs.infiniteScrollRef && hasMore && !refs.isSearching && !refs.haveScroll) {
      refs.isSearching = true;
      refs.haveScroll = refs.infiniteScrollRef.scrollHeight !== refs.infiniteScrollRef.clientHeight && (!size?.height ? true : refs.infiniteScrollRef.scrollHeight > size.height);
      //await new Promise((r) => setTimeout(() => r(1), 3000));
      fetchItems();
    }
  };

  const readjust = useCallback(() => {
    if (!refs.infiniteScrollRef) return;

    const { prevScrollHeight, infiniteScrollRef } = refs;
    const { scrollHeight, scrollTop } = infiniteScrollRef;

    const diff = calculateDiference(
      { scrollHeight, prevScrollHeight, scrollTop, loadingHeight, up: up === true }
    );

    refs.prevScrollHeight = scrollHeight;

    refs.infiniteScrollRef.scrollTop += diff;
  }, [up, loadingHeight]);

  const handleScroll = useCallback(async (e: UIEvent<HTMLDivElement>) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target as HTMLDivElement;

    refs.isAtTop = scrollTop === 0;
    refs.isAtBottom = scrollHeight - clientHeight === scrollTop;

    const condition: boolean = up ?
      scrollTop <= loadingHeight + margin :
      scrollHeight - clientHeight - margin - loadingHeight <= scrollTop;

    if (!refs.isSearching && hasMore && condition) {
      //await new Promise((r) => setTimeout(() => r(1), 3000));
      refs.isSearching = true;
      fetchItems()
    }
  }, [margin, up, fetchItems, loadingHeight]);

  useEffect(() => {
    if (hasMore) {
      if (itemsLength === refs.itemsCount) return readjust();
      refs.itemsCount = itemsLength;
      refs.isSearching = false;
      check();
    }
  }, [itemsLength, hasMore, check]);

  if (up) useEffect(() => {
    if (refs.isAtBottom && refs.infiniteScrollRef) refs.infiniteScrollRef.scrollTop = refs.infiniteScrollRef.scrollHeight
  }, [itemsLength, up]);

  const loadingComponent =
    <GetSize callback={({ height }) => setLoadingHeight(height)}>{loading}</GetSize>;

  const items: JSX.Element[] = [];
  for (let i = 0; i < itemsLength; i++) items[i] = renderItem(i);

  useEffect(() => {
    resetCb && resetCb(() => {
      refs.itemsCount = 0
      refs.prevScrollHeight = 0
      refs.isSearching = false
      refs.haveScroll = false
      refs.isAtTop = !up ? true : false
      refs.isAtBottom = up ? true : false
    })
  }, []);

  return (
    <div
      id={id}
      ref={(el) => { refs.infiniteScrollRef = el; ref && ref(el) }}
      onScroll={handleScroll}
      className={className}
      style={size}
    >
      {hasMore && up && loadingComponent}
      {items}
      {hasMore && !up && loadingComponent}
    </div>
  )
}
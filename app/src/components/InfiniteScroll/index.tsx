import { useCallback, UIEvent, useEffect, useRef, useState, useLayoutEffect } from "react";
import GetSize from "../GetSize";
import { IRefsInfiniteScroll, InfiniteScrollProps, SettingsScroll } from "./type";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";
import wait from "@/utils/wait";
import { useDispatch, useSelector } from "react-redux";
import { actions, getScrollItems } from "@/redux/slices/scrollItems";

/*
  ANNOTATIONS:
    - ScrollHeight the total height of scroll
    - ClientHeight the visible height of scroll
    - ScrollTop the current scroll number
*/

/**
 * 
 * @param props: { id: uuid } 
 * @returns 
 */
export default function InfiniteScroll(
  { id, loading, className, startFrom, giveRef, renderItem, fetchItems, scrollItemsKey, maxItems, maxVirtualItems, margin = 0 }:
    InfiniteScrollProps
) {
  const { current: refs } = useRef<IRefsInfiniteScroll>({
    infiniteScrollRef: null,
    timeout: 100,
    functionId: null,
    lastScrolls: {}
  });

  const [config, setConfig] = useState({ isFetching: false })
  const [actualLoadingHeight, setActualLoadingHeight] = useState<number>(0);
  const scrollItems = useSelector(getScrollItems)[scrollItemsKey] || { items: [], virtualItems: [], continueFetchingDown: true, continueFetchingUp: true, lastScrollStop: 0, maxItems, maxVirtualItems }
  const items = scrollItems.items
  const dispatch = useDispatch()

  const hasScroll = useCallback(() => {
    const beforeHeight = scrollItems.continueFetchingUp ? actualLoadingHeight : 0
    const afterHeight = scrollItems.continueFetchingDown ? actualLoadingHeight : 0

    return refs.infiniteScrollRef ? Math.floor(refs.infiniteScrollRef.scrollHeight - (beforeHeight + afterHeight)) > refs.infiniteScrollRef.clientHeight : false
  }, [scrollItems.continueFetchingDown, scrollItems.continueFetchingUp, actualLoadingHeight])

  useEffect(() => {
    if (scrollItemsKey !== refs.scrollItemsKey && refs.lastScrolls[scrollItemsKey] !== undefined) {
      refs.infiniteScrollRef!.scrollTop = refs.lastScrolls[scrollItemsKey]
    }

    refs.scrollItemsKey = scrollItemsKey
  }, [scrollItemsKey])

  useEffect(() => {
    if (config.isFetching || hasScroll() || (!scrollItems.continueFetchingDown && !scrollItems.continueFetchingUp)) {
      return;
    }

    const lastId = items.length ? items.at(startFrom === DirectionRequest.DOWN ? -1 : 0)._id : null

    setConfig({ isFetching: true })
    fetchItems(startFrom === DirectionRequest.DOWN ? TimeRequest.AFTER : TimeRequest.BEFORE, startFrom, lastId)
      .then(response => {
        dispatch(actions.set({
          id: scrollItemsKey,
          items: response?.newItems || [],
          continueFetchingDown: Boolean(startFrom === DirectionRequest.DOWN && response?.continue),
          continueFetchingUp: Boolean(startFrom === DirectionRequest.UP && response?.continue),
          direction: startFrom!
        }))
      })
      .catch(err => console.error("There was an error", err))
      .finally(() => setConfig({ isFetching: false }))
  }, [items, config, scrollItems, hasScroll])

  const handleScroll = useCallback(async (e: UIEvent<HTMLDivElement>) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target as HTMLDivElement;

    const lastScroll = refs.lastScrolls[scrollItemsKey] || 0
    const goToDown = scrollTop > lastScroll
    refs.lastScrolls[scrollItemsKey] = scrollTop

    //CAN REQUEST
    let directionTime = null;
    const beforeHeight = scrollItems.continueFetchingUp ? actualLoadingHeight : 0
    const afterHeight = scrollItems.continueFetchingDown ? actualLoadingHeight : 0

    if (scrollTop - margin <= beforeHeight && !goToDown) {
      directionTime = TimeRequest.BEFORE
    } else if (scrollTop >= scrollHeight - clientHeight - (afterHeight) - margin && goToDown) {
      directionTime = TimeRequest.AFTER
    }

    const currentTime = directionTime

    const isAfterTime = currentTime === TimeRequest.AFTER

    if (!config.isFetching && ((scrollItems.continueFetchingDown && isAfterTime) || (scrollItems.continueFetchingUp && !isAfterTime)) && currentTime) {
      setConfig({ isFetching: true })

      const lastId = items.at(isAfterTime ? -1 : 0)._id
      refs.lastItemId = lastId

      await wait(3)

      try {
        const results = await fetchItems(currentTime!, startFrom!, lastId!)

        if (!results) return;

        dispatch(actions.set({
          id: scrollItemsKey,
          items: results?.newItems as any[],
          continueFetchingDown: results.continue,
          continueFetchingUp: results.continue,
          direction: currentTime === TimeRequest.AFTER ? DirectionRequest.DOWN : DirectionRequest.UP
        }))
      } finally {
        setConfig({ isFetching: false })
      }
    }
  }, [margin, scrollItemsKey, hasScroll, items, startFrom, fetchItems, actualLoadingHeight, scrollItems.continueFetchingDown, scrollItems.continueFetchingUp, config]);

  const loadingComponent =
    <GetSize callback={({ height }) => setActualLoadingHeight(height)}>{loading}</GetSize>;

  useEffect(() => {
    if (!refs.infiniteScrollRef) return;
    const { scrollHeight, clientHeight } = refs.infiniteScrollRef

    return () => {
      if (!refs.infiniteScrollRef) return;
      const { scrollTop } = refs.infiniteScrollRef
      const beforeHeight = scrollItems.continueFetchingUp ? actualLoadingHeight : 0
      const afterHeight = scrollItems.continueFetchingDown ? actualLoadingHeight : 0

      const isAtBottom = (refs.lastScrolls[scrollItemsKey] || scrollTop) >= (scrollHeight - clientHeight)

      if (startFrom === DirectionRequest.UP && (!hasScroll() || isAtBottom)) {
        refs.infiniteScrollRef.scrollTop = refs.infiniteScrollRef.scrollHeight
        return;
      }

      if (refs.lastItemId && ((scrollTop >= 0 && scrollTop <= beforeHeight) || (scrollTop >= scrollHeight - clientHeight - (afterHeight)))) {
        document.getElementById(refs.lastItemId)?.scrollIntoView({
          block: "center",      // Puedes usar 'start', 'center', 'end', o 'nearest'
          inline: 'nearest'
        })
      }

      refs.lastItemId = ""
    }
  }, [items, actualLoadingHeight, scrollItems, hasScroll, scrollItemsKey])

  return (
    <div
      id={id}
      onLoad={(e) => {
        const imgElement = e.target as HTMLImageElement
        if(!refs.infiniteScrollRef || imgElement.tagName !== "IMG") return;

        refs.infiniteScrollRef.scrollTop += imgElement.height
      }}
      ref={(el) => { refs.infiniteScrollRef = el; giveRef && giveRef(el) }}
      className={className}
      onScroll={(e) => {
        if (!items.length) return;
        if (refs.functionId) clearTimeout(refs.functionId);

        refs.functionId = setTimeout(() => handleScroll(e), refs.timeout);
      }}
    >
      {scrollItems.continueFetchingUp && loadingComponent}
      {items.map(renderItem)}
      {scrollItems.continueFetchingDown && loadingComponent}
    </div>
  )
}
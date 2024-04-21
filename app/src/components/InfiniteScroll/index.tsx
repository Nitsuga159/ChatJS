import { useCallback, UIEvent, useEffect, useRef, useState, useLayoutEffect, useContext } from "react";
import GetSize from "../GetSize";
import { IRefsInfiniteScroll, InfiniteScrollProps, SettingsScroll } from "./type";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";
import wait from "@/utils/wait";
import { useDispatch, useSelector } from "react-redux";
import { actions, getScrollItems } from "@/redux/slices/scrollItems";
import { NumberMap } from "@/basic-types";
import { HttpClientContext } from "../Providers/http";
import { DefaultAPI, HTTP_METHOD } from "../Providers/http/api-interface";

/*
  ANNOTATIONS:
    - ScrollHeight the total height of scroll
    - ClientHeight the visible height of scroll
    - ScrollTop the current scroll number
*/

const lastScrolls: NumberMap = {}

/**
 * 
 * @param props: { id: uuid } 
 * @returns 
 */
export default function InfiniteScroll(
  { id, loading, className, startFrom, giveRef, renderItem, api, scrollItemsKey, maxItems, maxVirtualItems, margin = 0 }:
    InfiniteScrollProps
) {
  const { current: refs } = useRef<IRefsInfiniteScroll>({
    infiniteScrollRef: null,
    timeout: 50,
    functionId: null
  });

  const [config, setConfig] = useState({ isFetching: false })
  const [actualLoadingHeight, setActualLoadingHeight] = useState<number>(0);
  const scrollItems = useSelector(getScrollItems)[scrollItemsKey] || { items: [], virtualItems: [], continueFetchingDown: true, continueFetchingUp: true, lastScrollStop: 0, maxItems, maxVirtualItems }
  const items = scrollItems.items
  const dispatch = useDispatch()
  const httpClient = useContext(HttpClientContext)!

  const fetchItems = async (time: TimeRequest, to: DirectionRequest, lastId: string) => {
    api.setParam("time", time)
    api.setParam("to", to)
    api.setParam("lastId", lastId)

    const { data: { result: { canContinue, items } } } = await httpClient(api)

    return { canContinue, items }
  }

  const hasScroll = useCallback(() => {
    const beforeHeight = scrollItems.continueFetchingUp ? actualLoadingHeight : 0
    const afterHeight = scrollItems.continueFetchingDown ? actualLoadingHeight : 0

    return refs.infiniteScrollRef ? Math.floor(refs.infiniteScrollRef.scrollHeight - (beforeHeight + afterHeight)) > refs.infiniteScrollRef.clientHeight : false
  }, [scrollItems.continueFetchingDown, scrollItems.continueFetchingUp, actualLoadingHeight])

  useEffect(() => {
    if (scrollItemsKey !== refs.scrollItemsKey && lastScrolls[scrollItemsKey] !== undefined) {
      refs.infiniteScrollRef!.scrollTop = lastScrolls[scrollItemsKey]
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
      .then(({ canContinue, items }) => {
        dispatch(actions.set({
          id: scrollItemsKey,
          items: items || [],
          continueFetchingDown: Boolean(startFrom === DirectionRequest.DOWN && canContinue),
          continueFetchingUp: Boolean(startFrom === DirectionRequest.UP && canContinue),
          direction: startFrom!
        }))
      })
      .catch(err => console.error("There was an error", err))
      .finally(() => setConfig({ isFetching: false }))
  }, [items, config, scrollItems, hasScroll])

  const handleScroll = useCallback(async (e: UIEvent<HTMLDivElement>) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target as HTMLDivElement;

    const lastScroll = lastScrolls[scrollItemsKey] || 0
    const goToDown = scrollTop > lastScroll
    lastScrolls[scrollItemsKey] = scrollTop

    //CAN REQUEST
    let directionTime = null;
    const beforeHeight = scrollItems.continueFetchingUp ? actualLoadingHeight : 0
    const afterHeight = scrollItems.continueFetchingDown ? actualLoadingHeight : 0


    if (scrollTop - clientHeight - margin <= beforeHeight && !goToDown) {
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

     // await wait(3)

      try {
        const results = await fetchItems(currentTime!, startFrom!, lastId!)

        if (!results) return;

        dispatch(actions.set({
          id: scrollItemsKey,
          items: results?.items as any[],
          continueFetchingDown: results.canContinue,
          continueFetchingUp: results.canContinue,
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

      const isAtBottom = (lastScrolls[scrollItemsKey] || scrollTop) >= (scrollHeight - clientHeight)

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
        handleScroll(e)
      }}
    >
      {scrollItems.continueFetchingUp && loadingComponent}
      {items.map(renderItem)}
      {scrollItems.continueFetchingDown && loadingComponent}
    </div>
  )
}
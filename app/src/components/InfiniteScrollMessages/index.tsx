import { useCallback, UIEvent, useEffect, useRef, useState, useLayoutEffect } from "react";
import GetSize from "../GetSize";
import { IRefsInfiniteScroll, InfiniteScrollProps, SettingsScroll } from "./type";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";
import wait from "@/utils/wait";

/*
  ANNOTATIONS:
    - ScrollHeight the total height of scroll
    - ClientHeight the visible height of scroll
    - ScrollTop the current scroll number
*/

/**
 * 
 * @param props: { id: uuid, resetCb } 
 * @returns 
 */
export default function InfiniteScrollMessages(
  { id, items, limit, loading, className, settings, setSettings, giveRef, renderItem, fetchItems, scrollItemsKey, setItemFromSocket, margin = 0 }:
    InfiniteScrollProps
) {
  const { current: refs } = useRef<IRefsInfiniteScroll>({
    infiniteScrollRef: null,
    lastScroll: 0,
    timeout: 100,
    functionId: null
  });
  const { scrollTop, ...settingsWithoutScrolltop } = settings
  const [actualLoadingHeight, setActualLoadingHeight] = useState<number>(0);

  const hasScroll = useCallback(() => {
    const beforeHeight = settingsWithoutScrolltop.continueBefore ? actualLoadingHeight : 0
    const afterHeight = settingsWithoutScrolltop.continueAfter ? actualLoadingHeight : 0

    return refs.infiniteScrollRef ? Math.floor(refs.infiniteScrollRef.scrollHeight - (beforeHeight + afterHeight)) > refs.infiniteScrollRef.clientHeight : false
  }, Object.values(settingsWithoutScrolltop))

  const handleScroll = useCallback(async (e: UIEvent<HTMLDivElement>) => {
    setSettings((prev) => ({ ...prev, scrollTop: refs.infiniteScrollRef?.scrollTop } ))

    console.log("handleScroll")

    const { scrollHeight, clientHeight, scrollTop } = e.target as HTMLDivElement;

    //TOPPERS
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollHeight - clientHeight <= scrollTop;

    const lastScroll = refs.lastScroll
    const isDown = scrollTop > lastScroll

    //CAN REQUEST
    let directionTime = null;
    const beforeHeight = settingsWithoutScrolltop.continueBefore ? actualLoadingHeight : 0
    const afterHeight = settingsWithoutScrolltop.continueAfter ? actualLoadingHeight : 0

    if (scrollTop - margin <= beforeHeight && !isDown) {
      directionTime = TimeRequest.BEFORE
    } else if (scrollHeight - clientHeight - (afterHeight + beforeHeight) - margin <= scrollTop && isDown) {
      directionTime = TimeRequest.AFTER
    }

    refs.lastScroll = scrollTop

    const currentTime = directionTime || settingsWithoutScrolltop.directionTime

    const isAfterTime = currentTime === TimeRequest.AFTER

    if (!settingsWithoutScrolltop.isFetching && ((settingsWithoutScrolltop.continueAfter && isAfterTime) || (settingsWithoutScrolltop.continueBefore && !isAfterTime)) && directionTime) {

      console.log("llamando!")

      setSettings((prev) => ({ ...prev, isFetching: true, directionTime: currentTime }))

      refs.lastItemId = items.at(isAfterTime ? -1 : 0)._id

      await wait(3)

      try {
        const results = await fetchItems(currentTime!, settingsWithoutScrolltop.startFrom!)

        if (!results) return;
      } finally {
        console.log(refs.infiniteScrollRef?.scrollTop)
      }
    }
  }, [margin, setSettings, hasScroll, items, ...Object.values(settingsWithoutScrolltop), fetchItems, actualLoadingHeight]);

  const loadingComponent =
    <GetSize callback={({ height }) => setActualLoadingHeight(height)}>{loading}</GetSize>;

  useEffect(() => {
    if (!refs.infiniteScrollRef) return;

    if (settingsWithoutScrolltop.startFrom === DirectionRequest.UP) {
      refs.infiniteScrollRef.scrollTop = scrollTop !== undefined ? scrollTop : refs.infiniteScrollRef.scrollHeight
      refs.lastScroll = scrollTop !== undefined ? scrollTop : refs.infiniteScrollRef.scrollHeight
    } else if (refs.lastItemId && !settingsWithoutScrolltop.isFetching) {
      const { scrollHeight, clientHeight, scrollTop } = refs.infiniteScrollRef

      const beforeHeight = settingsWithoutScrolltop.continueBefore ? actualLoadingHeight : 0
      const afterHeight = settingsWithoutScrolltop.continueAfter ? actualLoadingHeight : 0

      if ((scrollTop >= 0 && scrollTop <= beforeHeight) || (scrollTop >= scrollHeight - clientHeight - (afterHeight + beforeHeight))) {
        console.log("scroll into view")
        document.getElementById(refs.lastItemId)?.scrollIntoView({
          block: "center",      // Puedes usar 'start', 'center', 'end', o 'nearest'
          inline: 'nearest'
        })
      }

      refs.lastItemId = ""
    } else {
      refs.infiniteScrollRef.scrollTop = scrollTop!
    }
  }, [items, ...Object.values(settingsWithoutScrolltop), scrollTop, actualLoadingHeight, handleScroll])

  return (
    <div
      id={id}
      ref={(el) => { refs.infiniteScrollRef = el; giveRef && giveRef(el) }}
      className={className}
      onScroll={(e: any) => {
        if(refs.functionId) {
          clearTimeout(refs.functionId);
        }

        refs.functionId = setTimeout(() => handleScroll(e), refs.timeout);
      }}
    >
      {settings.continueBefore && loadingComponent}
      {items.map(renderItem)}
      {settings.continueAfter && loadingComponent}
    </div>
  )
}

InfiniteScrollMessages.initState = function({ startFrom }: { startFrom: DirectionRequest }): SettingsScroll {
  return {
    isFetching: false,
    startFrom,
    directionTime: startFrom === DirectionRequest.DOWN ? TimeRequest.AFTER : TimeRequest.BEFORE,
    isAtBottom: startFrom === DirectionRequest.DOWN,
    isAtTop: startFrom === DirectionRequest.UP,
    continueBefore: startFrom === DirectionRequest.UP,
    continueAfter: startFrom === DirectionRequest.DOWN
  }
}
import * as S from "./Channels.styled";
import { channelActions, channelFetchs } from "@/redux/actions/channel";
import { getChannelState } from "@/redux/slices/channel";
import { getUserState } from "@/redux/slices/user";
import { useCallback, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapChannelItem } from "./maps";
import { failureNotification } from "@/helpers/notify";
import { getGeneralState } from "@/redux/slices/general";
import { ChatMode } from "@/redux/slices/general/type";
import { generalActions } from "@/redux/actions/general";
import ItemSelectionSkeleton from "@/components/Skeletons/ItemSelectionSkeleton";
import { SocketContext } from "@/components/Providers/SocketIO";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";
import ENVS from "@/envs";

export default function Channels() {
  const socket = useContext(SocketContext).socket;
  const dispatch = useDispatch();
  const { user } = useSelector(getUserState);
  const { channelsTabs: channels, channelsDetail: channelDetail, currentChannelId } = useSelector(getChannelState);
  const { chatMode } = useSelector(getGeneralState);

  const getChannels = useCallback(async (time: TimeRequest, to: DirectionRequest, lastId: string) => {
    try {
      const { results } = await channelFetchs.getChannels({
        query: {
          lastId,
          to,
          time
        },
        accessToken: user!.accessToken
      })

      return { continue: results.continue, newItems: results.channels }
    } catch (e: any) {
      console.log("error channel get", e)
      failureNotification(e.response.data.message);
    }
  }, [channels]);

  const handleOnSelect = useCallback(async (channelId: string) => {
    if (!channelDetail[channelId]) {
      dispatch(channelActions.setCurrentChannelChatId(null));

      try {

        const { results } = await channelFetchs.getChannelDetail({ channelId, accessToken: user?.accessToken! })

        socket?.emit("ROOM", { _id: results._id })

        dispatch(channelActions.getChannelDetail(results));
      } catch (e: any) {
        failureNotification(e.response.data.message);
      }
    } else {
      dispatch(channelActions.setCurrentChannelId(channelId))
    }

    if (chatMode !== ChatMode.CHANNEL_CHAT) dispatch(generalActions.setChatMode(ChatMode.CHANNEL_CHAT))
  }, [channelDetail, chatMode, socket]);

  return (
    <S.ChannelItemsContainer>
      <S.ItemsContainer>
        <S.SwitchFriendButton onClick={() => chatMode !== ChatMode.FRIEND_CHAT && dispatch(generalActions.setChatMode(ChatMode.FRIEND_CHAT))}>
          <S.SwitchFriendIcon />
        </S.SwitchFriendButton>
        <S.Line />
        <S.InfiniteScrollChannels
          renderItem={mapChannelItem(handleOnSelect)}
          fetchItems={getChannels}
          loading={<ItemSelectionSkeleton cuantity={8} reverse />}
          scrollItemsKey={ENVS.CHANNEL_TABS_ITEMS_ID}
          startFrom={DirectionRequest.DOWN}
        />
      </S.ItemsContainer>
    </S.ChannelItemsContainer>
  );
}
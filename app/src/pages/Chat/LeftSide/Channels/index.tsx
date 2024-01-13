import * as S from "./Channels.styled";
import { channelActions, channelFetchs } from "@/redux/actions/channel";
import { getChannelState } from "@/redux/slices/channel";
import { getUserState } from "@/redux/slices/user";
import { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapChannelItem } from "./maps";
import { failureNotification } from "@/helpers/notify";
import { getGeneralState } from "@/redux/slices/general";
import { ChatMode } from "@/redux/slices/general/type";
import { generalActions } from "@/redux/actions/general";
import ItemSelectionSkeleton from "@/components/Skeletons/ItemSelectionSkeleton";
import { SocketContext } from "@/components/Providers/SocketIO";
import { StartRequest, TimeRequest } from "@/redux/actions/channel/type";

export default function Channels() {
  const socket = useContext(SocketContext).socket;
  const dispatch = useDispatch();
  const { user } = useSelector(getUserState);
  const { channels, lastId, continue: canContinue, channelDetail } = useSelector(getChannelState);
  const { chatMode } = useSelector(getGeneralState);

  const getChannels = useCallback(async (time?: TimeRequest) => {

    //await new Promise((r) => setTimeout(() => r(1), 3000));
    try {
      const { results } = await channelFetchs.getChannels({
        query: {
          lastId: time ? channels.at(time === TimeRequest.AFTER ? -1 : 0)?._id || null : null, time
        },
        accessToken: user!.accessToken
      })

      dispatch(channelActions.getChannels(results))
    } catch (e: any) {
      console.log("error channel get", e)
      failureNotification(e.response.data.message);
    }
  }, [lastId, channels]);

  const handleOnSelect = useCallback(async (channelId: string) => {
    if (channelDetail?._id !== channelId) {
      dispatch(channelActions.setCurrentChannelChatId(null));

      try {

        const { results } = await channelFetchs.getChannelDetail({ channelId, accessToken: user?.accessToken! })

        socket?.emit("ROOM", { _id: results._id })

        dispatch(channelActions.getChannelDetail(results));
      } catch (e: any) {
        failureNotification(e.response.data.message);
      }
    }

    if (chatMode !== ChatMode.CHANNEL_CHAT) dispatch(generalActions.setChatMode(ChatMode.CHANNEL_CHAT))
  }, [channelDetail, chatMode]);

  return (
    <S.ChannelItemsContainer>
      <S.ItemsContainer>
        <S.SwitchFriendButton onClick={() => chatMode !== ChatMode.FRIEND_CHAT && dispatch(generalActions.setChatMode(ChatMode.FRIEND_CHAT))}>
          <S.SwitchFriendIcon />
        </S.SwitchFriendButton>
        <S.Line />
        <S.ChannelsItems
          itemsLength={channels.length}
          renderItem={mapChannelItem(handleOnSelect, channels)}
          fetchItems={getChannels}
          hasMore={canContinue}
          margin={300}
          loading={<ItemSelectionSkeleton cuantity={4} reverse />}
        />
      </S.ItemsContainer>
    </S.ChannelItemsContainer>
  );
}
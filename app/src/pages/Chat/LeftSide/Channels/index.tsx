import * as S from "./Channels.styled";
import { channelActions, channelFetchs } from "@/redux/actions/channel";
import { getChannelState } from "@/redux/slices/channel";
import { getUserState } from "@/redux/slices/user";
import { DefaultResponse } from "@/types/const.type";
import { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapChannelItem } from "./maps";
import { failureNotification } from "@/helpers/notify";
import { getGeneralState } from "@/redux/slices/general";
import { ChatMode } from "@/redux/slices/general/type";
import { generalActions } from "@/redux/actions/general";
import ItemSelectionSkeleton from "@/components/Skeletons/ItemSelectionSkeleton";
import { SocketContext } from "@/components/Providers/SocketIO";

export default function Channels() {
  const socket = useContext(SocketContext).socket;
  const dispatch = useDispatch();
  const { user } = useSelector(getUserState);
  const { channels, lastId, continue: canContinue, channelDetail } = useSelector(getChannelState);
  const { chatMode } = useSelector(getGeneralState);

  const getChannels = useCallback(async () => {

    //await new Promise((r) => setTimeout(() => r(1), 3000));
    const { ok, data, error } = await channelFetchs.getChannels(
      { lastId, accessToken: user?.accessToken! }
    ) as any as DefaultResponse

    if (ok) dispatch(channelActions.getChannels(data))
    else failureNotification(error!);
  }, [lastId]);

  const handleOnSelect = useCallback(async (channelId: string) => {
    if (channelDetail?._id !== channelId) {
      dispatch(channelActions.setCurrentChannelChatId(null));
      const { ok, data, error } = await channelFetchs.getChannelDetail({ channelId, accessToken: user?.accessToken! }) as any as DefaultResponse

      if (ok) dispatch(channelActions.getChannelDetail(data));
      else failureNotification(error!);
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
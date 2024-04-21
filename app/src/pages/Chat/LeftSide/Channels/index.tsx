import * as S from "./Channels.styled";
import { actions as channelActions, getChannelState } from "@/redux/slices/channel";
import { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { failureNotification } from "@/helpers/notify";
import { getGeneralState, getLanguage } from "@/redux/slices/general";
import { ChatMode } from "@/redux/slices/general/type";
import { generalActions } from "@/redux/actions/general";
import ItemSelectionSkeleton from "@/components/Skeletons/ItemSelectionSkeleton";
import { SocketContext } from "@/components/Providers/SocketIO";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";
import ENVS from "@/envs";
import ItemSelection from "@/components/ItemSelection";
import { SimpleChannel } from "@/redux/slices/channel/type";
import { CreateChannelAPI, CreateChannelAPIResponse, GetChannelAPI, GetChannelsAPI } from "@/components/Providers/http/channel-api-interface";
import { HttpClientContext } from "@/components/Providers/http";
import { ShowOnAllScreenContext } from "@/components/Providers/ShowOnAllScreen";
import Choice from "@/components/Choice";
import Form from "@/components/Form";
import channelForm from "./channel-form-stucture";
import { addLoader, removeLoader } from "@/helpers/loaderFullScreen/loaderFullScreen";
import { COLORS } from "@/styles";
import wait from "@/utils/wait";
import { actions } from "@/redux/slices/scrollItems";
import { ContextMenuContext } from "@/components/Providers/ContextMenu";
import { FaTrash, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { IoChatboxOutline, IoChatboxSharp, IoQrCode } from "react-icons/io5";
import t from "@/languages";
import channelText, { CHANNEL_TEXTS } from "@/languages/texts/channel.text";
import { IoIosExit } from "react-icons/io";
import { getUserState } from "@/redux/slices/user";

export default function Channels() {
  const socket = useContext(SocketContext).socket;
  const dispatch = useDispatch();
  const { channelsDetail, currentChannelId } = useSelector(getChannelState);
  const { chatMode } = useSelector(getGeneralState);
  const httpClient = useContext(HttpClientContext)!
  const showOnAllScreen = useContext(ShowOnAllScreenContext)
  const contextMenu = useContext(ContextMenuContext)
  const user = useSelector(getUserState).user!
  const language = useSelector(getLanguage)

  const handleOnSelect = useCallback(async (channelId: string) => {
    if (!channelsDetail[channelId]) {
      dispatch(channelActions.setCurrentChannelChatId(null));

      try {
        const { data: { result } } = await httpClient(new GetChannelAPI({ channelId }))

        socket?.emit("ROOM", { _id: result._id })

        dispatch(channelActions.getChannelDetail(result));
      } catch (e: any) {
        failureNotification(e.response.data.message);
      }
    } else {
      dispatch(channelActions.setCurrentChannelId(channelId))
    }

    if (chatMode !== ChatMode.CHANNEL_CHAT) dispatch(generalActions.setChatMode(ChatMode.CHANNEL_CHAT))
  }, [channelsDetail, chatMode, socket]);

  const mapChannelItem = (channel: SimpleChannel) => {
    const { name, photo, _id, admin } = channel

    const menuItemsAdmin = [
      { name: t(language, CHANNEL_TEXTS.ADD_PARTICIPANT), onSelect: () => {}, icon: <FaUserPlus /> },
      { name: t(language, CHANNEL_TEXTS.DELETE_PARTICIPANT), onSelect: () => {}, icon: <FaUserMinus />, color: COLORS.FOLLY, hasDivider: true },
      { name: t(language, CHANNEL_TEXTS.ADD_CHAT), onSelect: () => {}, icon: <IoChatboxSharp /> },
      { name: t(language, CHANNEL_TEXTS.DELETE_CHAT), onSelect: () => {}, icon: <IoChatboxOutline />, color: COLORS.FOLLY, hasDivider: true },
      { name: t(language, CHANNEL_TEXTS.INVITATION_CODE), onSelect: () => {}, icon: <IoQrCode /> },
      { name: t(language, CHANNEL_TEXTS.DELETE_CHANNEL), onSelect: () => {}, icon: <FaTrash />, color: COLORS.FOLLY },
    ]

    const menuItemsParticipant = [
      { name: t(language, CHANNEL_TEXTS.LEAVE_CHANNEL), onSelect: () => {}, icon: <IoIosExit />, color: COLORS.FOLLY },
    ]

    return (
        <ItemSelection
          name={name}
          onClick={() => handleOnSelect(_id)}
          onContextMenu={(e) => contextMenu(e, admin === user._id ? menuItemsAdmin : menuItemsParticipant)}
          key={_id}
          id={_id}
          isSelected={currentChannelId === _id}
        >
          {
            photo ?
              <S.PerfilImageItem src={photo} /> :
              <S.PerfilLetterItem>{name[0]}</S.PerfilLetterItem>
          }
        </ItemSelection>
    )
  };

  return (
    <S.ChannelItemsContainer>
      <S.ItemsContainer>
        <S.SwitchFriendButton onClick={() => chatMode !== ChatMode.FRIEND_CHAT && dispatch(generalActions.setChatMode(ChatMode.FRIEND_CHAT))}>
          <S.SwitchFriendIcon />
        </S.SwitchFriendButton>
        <S.Line />
        <S.InfiniteScrollChannels
          renderItem={mapChannelItem}
          api={new GetChannelsAPI({ params: { fields: "_id,name,photo,createdAt,admin" } })}
          loading={<ItemSelectionSkeleton cuantity={8} reverse />}
          scrollItemsKey={ENVS.CHANNEL_TABS_ITEMS_ID}
          startFrom={DirectionRequest.DOWN}
        />
        <div>
          <S.AddChannelButton 
            onClick={() => showOnAllScreen(
              (isOpen) => 
                <Choice 
                  prompt="Select an option" 
                  options={[{ name: "Create new Channel", value: "CHANNEL_CODE" }, { name: "Join with a code", value: "CHANNEL" }]}
                  onSelect={(v) => showOnAllScreen(
                    (_, close) => <Form title="Channel Form" onSumbit={async (form) => {
                      addLoader(COLORS.FOLLY)

                      try {
                        const { result } = (await httpClient(new CreateChannelAPI(form as any))).data as CreateChannelAPIResponse

                        dispatch(channelActions.getChannelDetail(result))
                        dispatch(generalActions.setChatMode(ChatMode.CHANNEL_CHAT))
                        dispatch(actions.add({ direction: DirectionRequest.UP, id: ENVS.CHANNEL_TABS_ITEMS_ID, item: result }))
                        close()
                      } finally {
                        removeLoader()
                      }
                    }} submitText="create" fields={channelForm} />
                  )} 
                />
            )}
          >
            +
          </S.AddChannelButton>
        </div>
      </S.ItemsContainer>
    </S.ChannelItemsContainer>
  );
}
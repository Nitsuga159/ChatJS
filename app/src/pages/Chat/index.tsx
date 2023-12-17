import * as S from './Chat.styled'
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import { useDispatch, useSelector } from "react-redux";
import { getGeneralState } from "@/redux/slices/general";
import ChannelMessages from "./Messages/ChannelMessages";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/components/Providers/SocketIO";
import { getChannelState, getChatChannelsState } from "@/redux/slices/channel";
import { ChatMode } from "@/redux/slices/general/type";
import { getFriendChatState, getFriendState } from "@/redux/slices/friend";
import FriendMessages from "./Messages/FriendMessages";
import { WS_CHANNEL, WS_FRIEND } from "@/ws.events";
import { ChannelMessage } from "@/redux/slices/channel/type";
import { channelActions } from "@/redux/actions/channel";
import { AppDispatch } from "@/redux/store";
import { friendActions } from "@/redux/actions/friend";
import { ResponseAddFriendMessage, ResponseDeleteFriendMessage } from "@/redux/actions/friend/type";
import { ResponseDeleteChannelMessage } from "@/redux/actions/channel/http-messages/type";


export default function Chat() {
  const socket = useContext(SocketContext).socket;
  const dispatch: AppDispatch = useDispatch();
  const { currentChatId: currentChannelChat } = useSelector(getChatChannelsState);
  const { currentChatId: currentFriendChat } = useSelector(getFriendChatState);
  const { friends } = useSelector(getFriendState);
  const { channelDetail } = useSelector(getChannelState);
  const { chatMode } = useSelector(getGeneralState);

  useEffect(() => {
    if (!socket) return;

    const addFriendMessage =
      (message: ResponseAddFriendMessage) => dispatch(friendActions.addMessage(message));

    const deleteFriendMessage =
      (data: ResponseDeleteFriendMessage) => {
        dispatch(friendActions.deleteMessages(data))
      }

    const addChannelMessage =
      (message: ChannelMessage) => {
        dispatch(channelActions.addMessage({ message, isToSend: false }))
      }

    const deleteChannelMessage =
      (data: ResponseDeleteChannelMessage) => {
        dispatch(channelActions.deleteMessages(data))
      }

    socket.on(WS_CHANNEL.NEW_CHANNEL_MESSAGE, addChannelMessage);
    socket.on(WS_CHANNEL.DELETE_CHANNEL_MESSAGE, deleteChannelMessage);
    socket.on(WS_FRIEND.NEW_FRIEND_MESSAGE, addFriendMessage);
    socket.on(WS_FRIEND.DELETE_FRIEND_MESSAGE, deleteFriendMessage);

    return () => {
      socket.off(WS_CHANNEL.NEW_CHANNEL_MESSAGE, addChannelMessage);
      socket.off(WS_CHANNEL.DELETE_CHANNEL_MESSAGE, deleteChannelMessage);
      socket.off(WS_FRIEND.NEW_FRIEND_MESSAGE, addFriendMessage);
      socket.off(WS_FRIEND.DELETE_FRIEND_MESSAGE, deleteFriendMessage);
    }
  }, [socket]);

  return (
    <S.ChatContainer>
      <LeftSide chatMode={chatMode} />
      {
        currentChannelChat && chatMode === ChatMode.CHANNEL_CHAT ?
          <S.MessagesContainer>

            <S.TitleContainer><S.ChatICon style={{ fontSize: 30 }} />
              <S.TitleParagraph>
                {channelDetail!.chats.filter(chat => chat._id === currentChannelChat)[0].name}
              </S.TitleParagraph>
            </S.TitleContainer>
            <ChannelMessages
              chatId={currentChannelChat}
            />
          </S.MessagesContainer> :

          currentFriendChat && chatMode === ChatMode.FRIEND_CHAT ?
            <S.MessagesContainer>
              <S.TitleContainer><S.ChatICon style={{ fontSize: 30 }} /> {friends.filter(friend => friend._id === currentFriendChat)[0].friend.username}</S.TitleContainer>
              <FriendMessages
                chatId={currentFriendChat}
              />
            </S.MessagesContainer> :
            <NoChatSelected />
      }
      <RightSide />
    </S.ChatContainer>
  )
}

function NoChatSelected() {
  return (
    <S.NoChatSelectedContainer>
      <S.ChatICon style={{ fontSize: 70 }} />
      <S.NoChatMessgae>Select a chat :)</S.NoChatMessgae>
    </S.NoChatSelectedContainer>
  )
}
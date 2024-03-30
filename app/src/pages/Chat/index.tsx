import * as S from './Chat.styled'
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import { useDispatch, useSelector } from "react-redux";
import { getGeneralState } from "@/redux/slices/general";
import ChannelMessages from "./Messages/ChannelMessages";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/components/Providers/SocketIO";
import { getChannelState } from "@/redux/slices/channel";
import { ChatMode } from "@/redux/slices/general/type";
import { getFriendState } from "@/redux/slices/friend";
import FriendMessages from "./Messages/FriendMessages";
import { WS_CHANNEL, WS_FRIEND } from "@/ws.events";
import { ChannelMessage } from "@/redux/slices/channel/type";
import { channelActions } from "@/redux/actions/channel";
import { AppDispatch } from "@/redux/store";
import { friendActions } from "@/redux/actions/friend";
import { ResponseAddFriendMessage, ResponseDeleteFriendMessage } from "@/redux/actions/friend/type";
import { ResponseDeleteChannelMessage } from "@/redux/actions/channel/http-messages/type";
import { actions } from '@/redux/slices/scrollItems';
import { DirectionRequest } from '@/redux/actions/channel/type';


export default function Chat() {
  const socket = useContext(SocketContext).socket;
  const dispatch: AppDispatch = useDispatch();
  const { friends, currentChatId: currentFriendChat } = useSelector(getFriendState);
  const { channelsDetail, currentChannelId, currentChatId: currentChannelChat } = useSelector(getChannelState);
  const { chatMode } = useSelector(getGeneralState);

  useEffect(() => {
    if (!socket) return;

    const addFriendMessage =
      (message: ResponseAddFriendMessage) => dispatch(friendActions.addMessage(message));

    const deleteFriendMessage =
      (data: ResponseDeleteFriendMessage) => {
       // dispatch(actions.removeMany({ id: data.friendId }))
      }

    const addChannelMessage =
      (message: ChannelMessage) => {
        dispatch(actions.add({ id: message.chatId, direction: DirectionRequest.DOWN, item: message }))
      }

    const deleteChannelMessage =
      (data: ResponseDeleteChannelMessage) => {
        dispatch(actions.removeMany({ id: data.chatId, valueIds: data.ids }))
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

  const chatIndex = currentChannelChat ? channelsDetail[currentChannelId!]!.chats.findIndex(chat => chat._id === currentChannelChat) : -1

  return (
    <S.ChatContainer>
      <LeftSide chatMode={chatMode} />
      {
        currentChannelChat && chatIndex !== -1 && chatMode === ChatMode.CHANNEL_CHAT ?
          <S.MessagesContainer>

            <S.TitleContainer>
              <S.ChatICon style={{ fontSize: 30 }} />
              <S.TitleParagraph>
                {channelsDetail[currentChannelId!]!.chats[chatIndex].name.toLocaleLowerCase()}
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
import styled from 'styled-components';
import Chat from '../Chat';
import { useContext, useEffect } from 'react';
import { SocketContext } from '@/components/Providers/SocketIO';
import ENVS from '@/envs';
import { useDispatch, useSelector } from 'react-redux';
import { getUserState } from '@/redux/slices/user';
import { WS_CHANNEL, WS_FRIEND, WS_USER } from '@/ws.events';
import { SimpleChannel } from '@/redux/slices/channel/type';
import { Friend } from '@/redux/slices/friend/type';
import Profile from '../Profile';
import { getGeneralState } from '@/redux/slices/general';
import CSSAnimation from '@/components/CSSAnimation';
import { useNavigate } from 'react-router-dom';
import { actions } from '@/redux/slices/scrollItems';
import { DirectionRequest } from '@/redux/actions/channel/type';
import { Notification } from '@/components/Providers/http/notification-api-reference';
import { actions as channelActions } from '@/redux/slices/channel';

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
`

export default function Home() {
  const user = useSelector(getUserState).user;
  const navigate = useNavigate();
  const { showProfile } = useSelector(getGeneralState);
  const socketContext = useContext(SocketContext);
  const dispatch = useDispatch();
  const { socket } = socketContext;

  useEffect(() => {
    if (!user) return;

    if (!socket) {
      socketContext.activate(ENVS.SOCKET_URL || 'http://localhost:4040/chat', user.accessToken)
    }
    
    return () => socketContext.disconnect();
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const newNotification = (notification: Notification) => {
      dispatch(actions.add({ direction: DirectionRequest.UP, id: ENVS.NOTIFICATION_ITEMS_ID, item: notification }))
    }

    socket.on(WS_USER.NEW_NOTIFICATION, newNotification)

    //CHANNEL_MESSAGE
    const addChannelMessage = (message: MessageChannel) => {
      console.log(message)
    }

    socket.on(WS_CHANNEL.NEW_CHANNEL_MESSAGE, addChannelMessage);

    //CHANNELS
    const addChannel = (channel: SimpleChannel) => {
      dispatch(channelActions.addChannel(channel));
    };

    socket.on(WS_CHANNEL.NEW_CHANNEL, addChannel);

    //FREINDS
    const addFriend = (friend: Friend) => {
      console.log("friend", friend)
    }

    socket.on(WS_FRIEND.NEW_FRIEND, addFriend);

    //NOFITICATIONS

    return () => {
      socket.off(WS_USER.NEW_NOTIFICATION, newNotification)

      //CHANNELS
      socket.off(WS_CHANNEL.NEW_CHANNEL, addChannel)

      //FRIENDS
      socket.off(WS_FRIEND.NEW_FRIEND, addFriend);
    }
  }, [socket]);

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user]);

  return (
    <HomeContainer>
      {user && <Chat />}
      {user && <CSSAnimation open={showProfile} timeout={200}>
        {(status) => <Profile user={user} cssStatus={status} />}
      </CSSAnimation>}
    </HomeContainer>
  );
}
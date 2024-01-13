import styled from 'styled-components';
import Chat from '../Chat';
import { useContext, useEffect } from 'react';
import { SocketContext } from '@/components/Providers/SocketIO';
import ENVS from '@/envs';
import { useDispatch, useSelector } from 'react-redux';
import { getUserState } from '@/redux/slices/user';
import { WS_CHANNEL, WS_FRIEND } from '@/ws.events';
import { SimpleChannel } from '@/redux/slices/channel/type';
import { channelActions } from '@/redux/actions/channel';
import { friendActions } from '@/redux/actions/friend';
import { Friend } from '@/redux/slices/friend/type';
import Profile from '../Profile';
import { getGeneralState } from '@/redux/slices/general';
import CSSAnimation from '@/components/CSSAnimation';
import { useNavigate } from 'react-router-dom';

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

    //CHANNELS
    const addChannel = (channel: SimpleChannel) => {
      dispatch(channelActions.addChannel(channel));
    };

    socket.on(WS_CHANNEL.NEW_CHANNEL, addChannel);

    //FREINDS
    const addFriend = (friend: Friend) => {
      dispatch(friendActions.addFriend(friend));
    }

    socket.on(WS_FRIEND.NEW_FRIEND, addFriend);

    //NOFITICATIONS

    return () => {
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
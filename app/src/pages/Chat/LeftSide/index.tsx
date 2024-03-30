import { ChatMode } from '@/redux/slices/general/type';
import Channels from './Channels';
import ChannelTabs from './ChannelTabs';
import styled from 'styled-components';
import FriendTabs from './FriendTabs';
import { COLORS } from '@/styles';
import ProfileNavBar from './ProfileNavBar';
import { useState } from 'react';
import InfiniteScroll from '@/components/InfiniteScroll';
import { DirectionRequest } from '@/redux/actions/channel/type';

const Container = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr;
  grid-template-rows: 1fr 60px;
  grid-template-areas: 
  "channels tabs"
  "channels navbar-profile";
  background-color: ${COLORS.BROWN_GRAY};
`

export default function LeftSide({ chatMode }: { chatMode: ChatMode }) {
  return (
    <Container>
      <Channels />
      {chatMode === ChatMode.CHANNEL_CHAT ? <ChannelTabs /> : <FriendTabs />}
      <ProfileNavBar />
    </Container >
  );
}
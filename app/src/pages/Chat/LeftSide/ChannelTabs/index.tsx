import { useSelector } from "react-redux";
import { ChannelTabsContainer } from "./ChannelTabs.styled";
import ChannelItems from "./ChannelItems/ChannelItems";
import { getChannelState } from "@/redux/slices/channel";

export default function ChannelTabs() {
  const { channelsDetail: channelDetail, currentChannelId } = useSelector(getChannelState);

  return (
    <ChannelTabsContainer>
      <ChannelItems
        title="text channels"
        channels={channelDetail[currentChannelId!]?.chats || []}
      />
      <ChannelItems
        title="voice channels"
        channels={[]}
      />
    </ChannelTabsContainer>
  )
}
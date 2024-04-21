import { useSelector } from "react-redux";
import * as S from "./ChannelTabs.styled";
import ChannelItems from "./ChannelItems/ChannelItems";
import { getChannelState } from "@/redux/slices/channel";
import { IoIosArrowDown } from "react-icons/io";
import Select from "@/components/Select";
import { useContext } from "react";
import { ContextMenuContext } from "@/components/Providers/ContextMenu";

export default function ChannelTabs() {
  const { channelsDetail, currentChannelId } = useSelector(getChannelState);
  const contextMenu = useContext(ContextMenuContext)

  return (
    <S.ChannelTabsContainer>
      <S.TitleContainer onClick={(e) => contextMenu(e, [{ name: "hola", onSelect: () => {} }])}>
        <S.Title>{channelsDetail[currentChannelId!].name}</S.Title>
        <IoIosArrowDown />
      </S.TitleContainer>
      <ChannelItems
        title="text channels"
        channels={channelsDetail[currentChannelId!]?.chats || []}
      />
      <ChannelItems
        title="voice channels"
        channels={[]}
      />
    </S.ChannelTabsContainer>
  )
}
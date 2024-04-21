import LogoIcon from "@/components/Svg/LogoIcon/LogoIcon";
import { COLORS, Z_INDEX } from "@/styles";
import styled, { keyframes } from "styled-components";
import { FaUserFriends } from "react-icons/fa";
import InfiniteScroll from "@/components/InfiniteScroll";

export const ChannelItemsContainer = styled.div`
  grid-area: channels;
  height: 100%;
  min-width: 70px;
`;

export const SwitchFriendButton = styled.button`
  position: relative;
  padding: 0.6rem 0.7rem;
  margin: 0 auto;
  margin-top: 0.5rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: ${COLORS.FOLLY};
  transition: border-radius 0.3s ease;
  &:active {
    background-color: ${COLORS.LIGHT_GRAY};
  }
  &:hover {
    border-radius: 5px;
  }
`;

export const SwitchFriendIcon = styled(FaUserFriends)`
  font-size: 1.5rem;
`;

export const Line = styled.div`
  height: 0.2rem;
  background-color: ${COLORS.BROWN_GRAY};
  margin-top: 0.5rem;
`;

export const ItemsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${COLORS.BLACK};
`;

export const InfiniteScrollChannels = styled(InfiniteScroll)`
  width: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0.5rem;
  padding-bottom: 0;
  border-bottom: 4px solid ${COLORS.BROWN_GRAY};
  &::-webkit-scrollbar {
    width: 4px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: ${COLORS.BROWN_GRAY};
    border-radius: 0;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${COLORS.LIGHT_GRAY};
    border-radius: 0;
  }
`;

export const ItemLabel = styled.span<{ top: number; left: number }>`
  position: fixed;
  font-weight: bolder;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  margin-left: 20px;
  min-width: min-content;
  max-width: 150px;
  padding: 0.4rem 0.7rem;
  margin-top: -0.4rem;
  border-radius: 5px;
  background-color: ${COLORS.FOLLY};
  z-index: ${Z_INDEX._98};
  &::after {
    content: "";
    position: absolute;
    top: calc(50% - 10px);
    left: -20px;
    width: 0px;
    height: 0px;
    border-right: 10px solid ${COLORS.FOLLY};
    border-left: 10px solid transparent;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
`;

export const PerfilImageItem = styled.img`
  width: 100%;
  height: 100%;
`;

export const PerfilLetterItem = styled.span`
`

export const PerfilLogoItem = styled(LogoIcon)``;

export const AddChannelButton = styled.button`
  font-size: 1.5rem;
  margin: 8px 0;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${COLORS.GRAY};
  transition: 0.3s ease all;
  &:hover {
    background-color: ${COLORS.FOLLY};
    border-radius: 25%;
  }
`

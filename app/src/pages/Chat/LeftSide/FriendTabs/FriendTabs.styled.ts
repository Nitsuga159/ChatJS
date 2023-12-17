import InfiniteScroll from "@/components/InfiniteScroll";
import LogoIcon from "@/components/Svg/LogoIcon/LogoIcon";
import { COLORS, PRE_VALUES } from "@/styles";
import styled from "styled-components";

export const FriendTabsContainer = styled(InfiniteScroll)`
  grid-area: tabs;
  width: 100%;
  padding: 0.5rem;
  background-color: ${COLORS.DARK};
  overflow-y: auto;
`;

export const FriendTabContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.LIGHT_GRAY};
  }
`;

export const FriendTabPhotoContainer = styled.div<{ messagesCount: number }>`
  position: relative;
  height: 35px;
  width: 35px;
  border-radius: 50%;
  ${({ messagesCount }) =>
    messagesCount
      ? `&::after {
    content: "${messagesCount > 99 ? 99 : messagesCount}";
    font-size: 12px;
    position: absolute;
    top: -2px;
    right: -8px;
    ${PRE_VALUES.FLEX}
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${COLORS.FOLLY};
  }`
      : ""}
`;

export const FriendTabUsername = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  overflow: hidden;
`;

export const Username = styled.p<{ color: string }>`
  width: 100%;
  margin-left: 15px;
  position: relative;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ color }) => color};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

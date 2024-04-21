import { COLORS, PRE_VALUES } from "@/styles";
import styled from "styled-components";

export const ChannelTabsContainer = styled.div`
  grid-area: tabs;
  height: 100%;
  background-color: ${COLORS.DARK};
  overflow-y: auto;
`;

export const TitleContainer = styled.div`
  ${PRE_VALUES.FLEX}
  justify-content: space-between;
  padding: 0 1rem;
  height: 50px;
  background-color: ${COLORS.BLACK};
`

export const Title = styled.h5`
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
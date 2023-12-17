import { COLORS } from "@/styles";
import styled from "styled-components";

export const ChannelTabsContainer = styled.div`
  grid-area: tabs;
  height: 100%;
  background-color: ${COLORS.DARK};
  padding: 0.8rem;
  overflow-y: auto;
`;

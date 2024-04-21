import styled from "styled-components";
import { BiMessageAlt } from "react-icons/bi";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";

export const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.GRAY};
  display: grid;
  grid-template-columns: 19rem 1fr 15.5rem;
  grid-template-rows: 100%;
`;

export const TitleContainer = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  padding: 0 1rem;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  text-align: left;
  background-color: ${COLORS.BLACK};
  z-index: ${Z_INDEX._99};
`;

export const TitleParagraph = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const MessagesContainer = styled.div`
  display: grid;
  grid-template-rows: 50px calc(100% - 50px);
`;

export const NoChatSelectedContainer = styled.div`
  height: 100%;
  ${PRE_VALUES.FLEX}
  flex-direction: column;
`;

export const ChatICon = styled(BiMessageAlt)`
  color: ${COLORS.FOLLY};
`;

export const NoChatMessgae = styled.h4`
  font-size: 1.2rem;
  font-weight: 300;
`;

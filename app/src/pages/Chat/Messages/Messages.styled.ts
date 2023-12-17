import InfiniteScroll from "@/components/InfiniteScroll";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import styled, { keyframes } from "styled-components";

export const ChatContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding-top: 0;
  background-color: ${COLORS.BROWN_GRAY};
  *::-webkit-scrollbar {
    height: 4px;
  }
  *::-webkit-scrollbar-thumb {
    background-color: ${COLORS.LIGHT_GRAY};
  }
  *::-webkit-scrollbar-track {
    background-color: ${COLORS.DARK};
  }
`;

export const ChatMessages = styled(InfiniteScroll)`
  height: 100%;
  overflow-y: auto;
`;

export const ChatInput = styled.textarea<{ height: number }>`
  overflow-y: ${({ height }) => (height > 200 ? "auto" : "hidden")};
  font-family: arial;
  font-weight: 100;
  font-size: 0.95rem;
  letter-spacing: 1px;
  height: auto;
  width: 95%;
  padding: 0.6rem 0.8rem;
  margin: 0 auto;
  margin-top: 1rem;
  border: none;
  outline: none;
  border-radius: 5px;
  color: white;
  background-color: ${COLORS.LIGHT_GRAY};
  resize: none;
`;

export const LoadingMessagesContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  width: calc(100vw - 19rem - 13rem);
  overflow-x: auto;
`;

const animationNavBar = keyframes`
  0% { opacity: 0; transform: scale(0.7); }
  100% { opacity: 1; transform: scale(1); }
`;

export const NavBarDeleteMessages = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 1rem 0;
  height: 40px;
  background-color: ${COLORS.FOLLY};
  border-radius: 6px;
  z-index: ${Z_INDEX._97};
  animation: ${animationNavBar} 0.6s ease forwards;
`;

export const SelectedMessages = styled.p`
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bolder;
`;

export const Buttons = styled.div`
  ${PRE_VALUES.FLEX}
  gap: .5rem;
`;

export const RemoveMessagesIcon = styled(FaTrash)`
  font-size: 1rem;
`;

export const CancelMessagesIcon = styled(MdCancel)`
  font-size: 1.25rem;
`;

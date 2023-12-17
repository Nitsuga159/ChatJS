import styled, { keyframes } from "styled-components";
import LogoIcon from "../Svg/LogoIcon/LogoIcon";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";
import { EAnimationStatus } from "../CSSAnimation/type";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MessageStatus } from "@/types/chat.type";

export const Row = styled.div<{
  isHeader?: boolean;
  isToDelete?: boolean;
  deleteMode?: boolean;
  status?: MessageStatus;
}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0.2rem;
  padding-right: 1rem;
  transition: background-color 0.1s ease;
  margin-top: ${({ isHeader }) => (isHeader ? "1rem" : 0)};
  &:hover {
    background-color: ${COLORS.GRAY};
  }
  background-color: ${({ isToDelete }) => (isToDelete ? COLORS.GRAY : "")};
  opacity: ${({ isToDelete }) => (isToDelete ? 0.4 : 1)};
  cursor: ${({ deleteMode }) => (deleteMode ? "pointer" : "default")};
  ${({ status }) =>
    status === MessageStatus.WAITING
      ? { opacity: 0.6 }
      : status === MessageStatus.FAILURE
      ? { color: COLORS.FOLLY }
      : {}}
`;

export const MessageContainer = styled.div`
  width: 100%;
  text-align: left;
  > * {
    user-select: text;
  }
`;

export const From = styled.h6<{ color: string }>`
  font-size: 1.05rem;
  text-align: left;
  color: ${({ color }) => color};
`;

export const Text = styled.p`
  font-weight: 500;
  font-size: 1rem;
  font-family: sans-serif;
  text-align: left;
  word-break: break-word;
`;

export const LeftSideContainer = styled.div`
  ${PRE_VALUES.FLEX}
  padding-right: 1rem;
  margin-top: 0.3rem;
  margin-left: 0.2rem;
`;

export const DefaultPhoto = styled(LogoIcon)`
  transform: scale(0.95);
  width: 35px;
  height: 35px;
`;

export const UserPhoto = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

export const Date = styled.span<{ isHeader: boolean; isIn: boolean }>`
  font-weight: 100;
  font-size: 0.6rem;
  padding: 0 ${({ isHeader }) => (isHeader ? ".2rem" : "5px")};
  color: ${({ isIn }) => (isIn ? COLORS.SHINE_GRAY : "transparent")};
`;

export const MessageImage = styled.img`
  border-radius: 5px;
  text-align: left;
  width: auto;
  height: auto;
  max-height: 200px;
  max-width: 80%;
  display: block;
  margin: 1rem 0;
  cursor: pointer;
`;

const show = keyframes`
  from { transform: scale(.5); opacity: 0 }
  70% { transform: scale(1.02); opacity: 0.8 }
  to { transform: scale(1); opacity: 1 }
`;

const dissaper = keyframes`
  from { transform: scale(1); opacity: 1 }
  to { transform: scale(.5); opacity: 0 }
`;

export const MessageImageComplete = styled.img<{ status: EAnimationStatus }>`
  width: auto;
  height: auto;
  max-height: 50%;
  max-width: 80%;
  animation: ${({ status }) =>
      status === EAnimationStatus.IN ? show : dissaper}
    0.3s ease forwards;
`;

export const RemoveMessagesIcon = styled(FaTrash)`
  font-size: 0.9rem;
`;

export const CancelMessagesIcon = styled(MdCancel)`
  font-size: 1.1rem;
`;

export const RemoveMessageCheckboxContainer = styled.div`
  ${PRE_VALUES.FLEX}

  padding: 0 0.5rem;
`;

export const RemoveMessageCheckbox = styled.input`
  border: none;
  outline: none;
  &:checked {
    background: ${COLORS.FOLLY};
  }
`;

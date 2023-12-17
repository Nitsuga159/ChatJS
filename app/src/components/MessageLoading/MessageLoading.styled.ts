import { COLORS } from "@/styles";
import styled, { keyframes } from "styled-components";
import { EMessagesToSendStatus } from "@/redux/slices/channel/type";
import { IoReloadCircleSharp } from "react-icons/io5";

const animation = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const LoadingMessageContainer = styled.div<{
  status: EMessagesToSendStatus;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 130px;
  border-radius: 5px;
  text-align: left;
  padding: 0.5rem;
  background: linear-gradient(
    90deg,
    ${COLORS.LIGHT_GRAY},
    ${COLORS.DARK},
    ${COLORS.LIGHT_GRAY}
  );
  background-size: 200% 200%;
  box-shadow: 2px 2px 3px ${COLORS.BLACK};
  animation: ${({ status }) =>
      status === EMessagesToSendStatus.WAITING ? animation : ""}
    3s linear infinite;
  color: ${({ status }) =>
    status === EMessagesToSendStatus.WAITING ? "white" : COLORS.FOLLY};
`;

export const LoadingMessageImage = styled(IoReloadCircleSharp)`
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

export const LoadingMessageValue = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.6;
`;

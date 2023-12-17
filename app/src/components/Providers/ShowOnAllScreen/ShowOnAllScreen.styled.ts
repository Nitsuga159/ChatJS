import { EAnimationStatus } from "@/components/CSSAnimation/type";
import { COLORS, Z_INDEX } from "@/styles";
import styled, { keyframes } from "styled-components";

const show = keyframes`
  from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;

const dissaper = keyframes`
  from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
`;

export const ShowContainer = styled.div<{ status: EAnimationStatus }>`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000c;
  z-index: ${Z_INDEX._99};
  animation: ${({ status }) =>
      EAnimationStatus.IN === status ? show : dissaper}
    0.5s ease forwards;
`;

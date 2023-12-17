import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";
import styled, { keyframes } from "styled-components";
import { BiExit } from "react-icons/bi";
import { EAnimationStatus } from "@/components/CSSAnimation/type";

const inAnimation = keyframes`
  0% { opacity: 0; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
`;

const outAnimation = keyframes`
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.2); }
`;

export const Container = styled.div<{ status: EAnimationStatus }>`
  ${PRE_VALUES.FLEX}
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(1, 1, 1, 0.8);
  z-index: ${Z_INDEX._99};
  animation: ${({ status }) =>
      status === EAnimationStatus.IN ? inAnimation : outAnimation}
    0.2s ease forwards;
`;

export const SubContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: left;
  position: relative;
  width: 50%;
  height: 100%;
`;

export const ImageCropContainer = styled.div`
  width: 100%;
  height: 50%;
  border-radius: 6px;
  overflow: hidden;
  margin: 1rem 0;
`;

export const Title = styled.h5`
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

export const Paragraph = styled.p`
  margin: 0.1rem 0;
  margin-left: 1rem;
`;

export const RenderContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 0.5rem 1rem;
`;

export const RenderCanvas = styled.div<{ frame: number[] }>`
  ${({ frame: [width, height] }) => ({ width, height })}
  outline: 2px solid ${COLORS.FOLLY};
`;

export const ExitIcon = styled(BiExit)`
  font-size: 2.5rem;
  position: absolute;
  right: 0;
  top: 2rem;
  color: ${COLORS.FOLLY};
  cursor: pointer;
`;

export const ConfirmButton = styled.button`
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 3px;
  background-color: ${COLORS.SUCCESS};
`;

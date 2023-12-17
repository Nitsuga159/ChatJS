import { COLORS, PRE_VALUES } from "@/styles";
import styled from "styled-components";

export const Container = styled.div<{ dimension: number[] }>`
  ${({ dimension: [width, height] }) => ({ width, height })}
  position: relative;
  overflow: hidden;
`;

export const Canvas = styled.canvas`
  background-color: ${COLORS.BROWN_GRAY};
`;

export const Frame = styled.div<{ frame: number[] }>`
  ${({ frame: [width, height] }) => ({ width, height })}
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  top: 4px;
  left: 4px;
  position: absolute;
  border-radius: 5px;
  cursor: crosshair;
  color: ${COLORS.FOLLY};
  background-color: rgba(1, 1, 1, 0.2);
`;

export const FrameLeftTop = styled.div`
  box-shadow: -3px -3px ${COLORS.FOLLY};
`;

export const FrameLeftBottom = styled.div`
  box-shadow: -3px 3px ${COLORS.FOLLY};
`;

export const FrameRightTop = styled.div`
  box-shadow: 3px -3px ${COLORS.FOLLY};
`;

export const FrameRightBottom = styled.div`
  box-shadow: 3px 3px ${COLORS.FOLLY};
`;

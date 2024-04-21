import { COLORS } from "@/styles";
import styled, { keyframes } from "styled-components";

export const LoadImage = styled.div<{ width?: number | string, height?: number | string }>`
    width: ${({ width }) => width || 0}px;
    height: ${({ height }) => height || 0}px;
    background-color: ${COLORS.BLACK};
    border-radius: 10px;
`
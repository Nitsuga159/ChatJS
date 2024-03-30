import { COLORS } from "@/styles";
import styled, { keyframes } from "styled-components";

export const LoadImage = styled.div<{ width: number, height: number }>`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: ${COLORS.BLACK};
    border-radius: 10px;
`
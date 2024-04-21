import { COLORS, PRE_VALUES } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
    position: relative;
`

export const TitleContainer = styled.div`
  ${PRE_VALUES.FLEX}
  justify-content: space-between;
  padding: 0 1rem;
  height: 50px;
  background-color: ${COLORS.BLACK};
  border-bottom: 2px solid ${COLORS.MIDDLE_BLACK};
`

export const Title = styled.h5`
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const OptionsContainer = styled.div<{ open: boolean, length: number }>`
    width: 100%;
    position: absolute;
    transition: 0.2s ease all;
    transform-origin: top center;
    transform: ${({ open }) => open ? "scale(.9)" : "scale(0)"};
    border-radius: 0px 0px 5px 5px;
    overflow: hidden;
    background-color: ${COLORS.BLACK};
`

export const Option = styled.div`
    position: relative;
    font-size: .9rem;
    margin: 7px 5px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: ${COLORS.FOLLY};
    }
    &::after {
        content: "";
        width: 100%;
        position: absolute;
        border-bottom: 2px solid ${COLORS.DARK};
        top: 100%;
        left: 0;
    }
`
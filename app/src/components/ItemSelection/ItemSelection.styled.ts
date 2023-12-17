import styled from "styled-components";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";
import { ILabelItem } from "./type";

export const ItemSelectionContainer = styled.div<{
  label: ILabelItem;
  name: string;
}>`
  ${PRE_VALUES.FLEX};
  position: relative;
  font-weight: bolder;
  font-size: 1.1rem;
  width: 45px;
  height: 45px;
  background-color: ${COLORS.BROWN_GRAY};
  border-radius: 50%;
  margin: 0.6rem auto;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border-radius: 8px;
  }
  &::before {
    width: 0px;
    height: 0px;
    border-right: 12px solid ${COLORS.FOLLY};
    border-left: 12px solid transparent;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    cursor: default;
  }
  &::after {
    position: fixed;
    font-size: 1rem;
    font-weight: 600;
    margin-left: 20px;
    min-width: min-content;
    max-width: 150px;
    padding: 0.2rem 0.7rem;
    margin-top: -0.4rem;
    border-radius: 5px;
    background-color: ${COLORS.FOLLY};
    z-index: ${Z_INDEX._98};
    cursor: default;
  }
  ${({ label, name }) =>
    label.show
      ? `&::after {
    content: '${name}';
    top: calc(${label.top}px + .2rem);
    left: ${label.left}px;
  }
  &::before {
    content: "";
    position: fixed;
    top: ${label.top}px;
    left: ${label.left}px;
  }`
      : ""}
  &:active {
    opacity: 0.6;
  }
`;

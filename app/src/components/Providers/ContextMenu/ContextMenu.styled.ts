import styled from "styled-components";
import { MenuSettingsType } from "./type";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";

export const Menu = styled.div<Omit<MenuSettingsType, "items">>`
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  gap: .2rem;
  top: ${({ top, height, isUp }) => `${isUp ? top - height : top}px`};
  left: ${({ left }) => `${left}px`};
  min-width: 180px;
  padding: 0.4rem;
  position: fixed;
  transform-origin: ${({ isUp }) => isUp ? "left bottom" : "left top"};
  border-radius: 0 6px 6px;
  animation: show-context-menu 0.2s ease forwards;
  background-color: ${COLORS.DARK};
  z-index: ${Z_INDEX._99};
  box-shadow: 0px 0px 15px 3px ${COLORS.BLACK};
  @keyframes show-context-menu {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    80% {
      transform: scale(1.02);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const MenuItem = styled.div<{ hasDivider?: boolean, color?: string }>`
  ${PRE_VALUES.FLEX}
  position: relative;
  justify-content: space-between;
  text-align: left;
  font-size: 14px;
  padding: 0.1rem 0.4rem;
  cursor: pointer;
  border-radius: 3px;
  color: ${({ color }) => color || undefined};
  &:hover {
    background-color: ${({ color }) => color || COLORS.LIGHT_GRAY};
    color: white;
  }
`;

export const Divider = styled.div`
  width: 100%;
  border-bottom: 2px solid ${COLORS.LIGHT_GRAY};
`

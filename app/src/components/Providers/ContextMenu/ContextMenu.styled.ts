import styled from "styled-components";
import { MenuSettingsType } from "./type";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";

export const Menu = styled.div<Omit<MenuSettingsType, "items">>`
  display: ${({ open }) => (open ? "block" : "none")};
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
  min-width: 180px;
  padding: 0.4rem;
  position: fixed;
  transform-origin: left top;
  border-radius: 6px;
  animation: show-context-menu 0.2s ease forwards;
  background-color: ${COLORS.BLACK};
  z-index: ${Z_INDEX._99};
  @keyframes show-context-menu {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const MenuItem = styled.div`
  ${PRE_VALUES.FLEX}
  justify-content: space-between;
  text-align: left;
  padding: 0.1rem 0.4rem;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${COLORS.LIGHT_GRAY};
  }
`;

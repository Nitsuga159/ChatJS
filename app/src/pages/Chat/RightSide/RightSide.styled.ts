import styled from "styled-components";
import { COLORS, PRE_VALUES } from "@/styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: ${COLORS.DARK};
`;

export const NavBarSection = styled.div`
  ${PRE_VALUES.FLEX};
  align-items: flex-end;
  justify-content: space-evenly;
  padding: 0.3rem;
`;

export const ItemSection = styled.button<{ isActive: boolean }>`
  ${PRE_VALUES.FLEX};
  padding: 0.5rem;
  font-size: 1.3rem;
  cursor: pointer;
  color: ${COLORS.SHINE_GRAY};
  background-color: ${COLORS.GRAY};
  border-radius: 8px;
  ${({ isActive }) => isActive && { backgroundColor: COLORS.FOLLY }}
  &:hover {
    background-color: ${COLORS.FOLLY};
  }
`;

import styled from "styled-components";
import { CoordsType } from "./type";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";

export const OptionsContainer = styled.div<{ coords: CoordsType }>`
  ${({ coords }) => coords}
  ${PRE_VALUES.FLEX}
  padding: 0.4rem 0.7rem;
  position: absolute;
  gap: 1rem;
  background-color: ${COLORS.DARK};
  border-radius: 7px;
  z-index: ${Z_INDEX._96};
`;

export const ItemOption = styled.span``;

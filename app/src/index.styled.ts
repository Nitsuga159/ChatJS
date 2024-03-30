import styled from "styled-components";
import { COLORS } from "./styles";

export const DefaultButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: .3rem .4rem;
  &:active {
    transform: scale(0.9);
    color: ${COLORS.GRAY};
  }
`;

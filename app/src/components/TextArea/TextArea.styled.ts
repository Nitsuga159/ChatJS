import { COLORS, PRE_VALUES } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding: 0.7rem;
  justify-content: center;
  align-items: flex-start;
  border-radius: 5px;
  background-color: ${COLORS.LIGHT_GRAY};
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const FileButton = styled.button`
  ${PRE_VALUES.FLEX}
  background-color: transparent;
  border: none;
  padding: 0 0.5rem 0 0.3rem;
  cursor: pointer;
  &:hover {
    color: ${COLORS.FOLLY};
  }
`;

export const Input = styled.textarea<{
  height: number;
  maxAutoHeight: number;
}>`
  overflow-y: ${({ height, maxAutoHeight }) =>
    height > maxAutoHeight ? "auto" : "hidden"};
  font-family: arial;
  font-weight: 100;
  font-size: 0.95rem;
  letter-spacing: 1px;
  line-height: 20px;
  height: auto;
  width: 100%;
  margin: 0 auto;
  border: none;
  outline: none;
  color: white;
  background-color: transparent;
  resize: none;
`;

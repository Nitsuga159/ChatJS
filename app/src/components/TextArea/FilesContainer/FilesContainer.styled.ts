import { COLORS, PRE_VALUES } from "@/styles";
import { FaTrash } from "react-icons/fa";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
  border-bottom: 1px solid ${COLORS.DARK};
  user-select: none;
`;

export const FileItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.8rem;
  border-radius: 4px;
  background-color: ${COLORS.BLACK};
`;

export const FileSubContainer = styled.div`
  ${PRE_VALUES.FLEX}
  height: 150px;
  width: 150px;
`;

export const ImgFile = styled.img`
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
  display: block;
`;

export const FileName = styled.span`
  display: block;
  margin-top: 0.3rem;
  font-family: sans-serif;
  text-align: left;
  font-size: 0.8rem;
  color: ${COLORS.SHINE_GRAY};
`;

export const RemoveFileButton = styled(FaTrash)`
  position: absolute;
  right: -5px;
  top: -5px;
  transition: color 0.3s ease;
  cursor: pointer;
  &:hover {
    color: ${COLORS.FOLLY};
  }
`;

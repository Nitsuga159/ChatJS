import { COLORS } from "@/styles";
import ReactCrop from "react-image-crop";
import styled from "styled-components";

export const AccountContainer = styled.div`
  position: relative;
  width: 90%;
  margin: 1.5rem auto;
  border-radius: 7px;

  background-color: ${COLORS.MIDDLE_BLACK};
`;

export const Header = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  background-color: ${COLORS.BLACK};
  border-bottom: 2px solid ${COLORS.SHINE_GRAY};
`;

export const ContainerPhoto = styled.div`
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 8px ${COLORS.MIDDLE_GRAY}, 0 -8px ${COLORS.MIDDLE_GRAY},
    8px 0 ${COLORS.MIDDLE_GRAY}, -8px 0 ${COLORS.MIDDLE_GRAY};
`;

export const Username = styled.h4<{ color: string }>`
  letter-spacing: 0.8px;
  margin-left: 1.2rem;
  font-size: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  color: ${({ color }) => color};
`;

export const SubContainer = styled.div`
  margin: 0 auto;
  padding: 1rem;
  text-align: left;
`;

export const Title = styled.h6`
  font-weight: 100;
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

export const Description = styled.textarea`
  min-height: 70px;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  background-color: ${COLORS.GRAY};
  border: none;
  outline: none;
  overflow: hidden;
  resize: none;
`;

export const Color = styled.input`
  width: 40px;
  height: 40px;
  &[type="color"] {
    overflow: hidden;
    border-radius: 50%;
    padding: 0;
    border: 3px solid ${COLORS.BLACK};
  }

  &[type="color"]::-moz-color-swatch {
    border: none;
  }

  &[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 0;
  }

  &[type="color"]::-webkit-color-swatch {
    border: none;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 1rem;
  height: 2rem;
`;

export const Button = styled.button<{ bgcolor: string }>`
  height: 100%;
  font-size: 0.9rem;
  padding: 0 0.4rem;
  border-radius: 4px;
  background-color: ${(props) => props.bgcolor};
`;

export const UploadPerfilImage = styled.img`
  width: auto;
  height: auto;
  max-width: 500px;
  max-height: 500px;
`;

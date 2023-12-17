import { EAnimationStatus } from "@/components/CSSAnimation/type";
import { COLORS, PRE_VALUES, Z_INDEX } from "@/styles";
import styled, { keyframes } from "styled-components";
import { MdOutlineCancel } from "react-icons/md";

export const enterAnimation = keyframes`
  0% { opacity: 0; transform: scale(1.4) }
  100% { opacity: 1; transform: scale(1) }
`;

export const outAnimation = keyframes`
  0% { opacity: 1; transform: scale(1) }
  100% { opacity: 0; transform: scale(1.4) }
`;

export const ProfileContainer = styled.div<{ status: EAnimationStatus }>`
  ${PRE_VALUES.FLEX}
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${Z_INDEX._99};
  background-color: ${COLORS.DARK};
  animation: ${({ status }) =>
      status === EAnimationStatus.OUT
        ? outAnimation
        : status === EAnimationStatus.IN
        ? enterAnimation
        : ""}
    0.2s ease forwards;
`;

export const ProfileMain = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 145px 1fr;
  width: 60%;
  height: 60%;
  margin: 0 auto;
  border-radius: 4px;
`;

export const ProfileMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: ${COLORS.LIGHT_GRAY};
  padding: 0.5rem;
`;

export const ProfileMenuItem = styled.p`
  width: 100%;
  text-align: left;
  font-size: 1.1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.MIDDLE_GRAY};
  }
`;

export const ProfileContent = styled.div`
  background-color: ${COLORS.GRAY};
  overflow: auto;
`;

export const OutIcon = styled(MdOutlineCancel)`
  position: absolute;
  top: 10px;
  right: -50px;
  width: 45px;
  height: 45px;
  cursor: pointer;
`;

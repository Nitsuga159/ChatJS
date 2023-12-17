import { COLORS, PRE_VALUES } from "@/styles";
import styled from "styled-components";

export const ProfileNavBarContainer = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  grid-template-rows: 35px;
  align-items: center;
  align-content: center;
  grid-area: navbar-profile;
  padding: 0.5rem 0.7rem;
  background-color: ${COLORS.MIDDLE_BLACK};
`;

export const Profile = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 35px 1fr;
  padding: 0.2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${COLORS.GRAY};
  }
`;

export const ProfilePhotoContainer = styled.div`
  ${PRE_VALUES.FLEX}
`;

export const ProfileUsername = styled.p<{ color: string }>`
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 0.4rem;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ color }) => color};
`;

export const ProfileButtons = styled.div`
  ${PRE_VALUES.FLEX}
  justify-content: space-between;
  font-size: 1.3rem;
  padding: 0 0.2rem;
`;

export const MicrophoneButton = styled.div<{ isActive: boolean }>`
  ${PRE_VALUES.FLEX}
  color: ${({ isActive }) => (isActive ? COLORS.FOLLY : COLORS.SHINE_GRAY)};
  cursor: pointer;
`;

export const HeadphoneButton = styled.div<{ isActive: boolean }>`
  ${PRE_VALUES.FLEX}
  color: ${({ isActive }) => (isActive ? COLORS.FOLLY : COLORS.SHINE_GRAY)};
  cursor: pointer;
`;

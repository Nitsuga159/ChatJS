import styled from "styled-components";
import LogoIcon from "../Svg/LogoIcon/LogoIcon";
import Image from "../Image";
import { COLORS } from "@/styles";

export const FriendTabPhoto = styled(Image)`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: ${COLORS.BLACK};
`;

export const FriendTabDefaultPhoto = styled(LogoIcon)`
  width: 100%;
  height: 100%;
`;

export default function ProfileAvatar({ photo, color }: { photo?: string | null, color: string }) {
  return (
    photo ? <FriendTabPhoto src={photo} /> : <FriendTabDefaultPhoto color={color} />
  )
}
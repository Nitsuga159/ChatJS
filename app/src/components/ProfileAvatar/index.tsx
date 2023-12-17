import styled from "styled-components";
import LogoIcon from "../Svg/LogoIcon/LogoIcon";

export const FriendTabPhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
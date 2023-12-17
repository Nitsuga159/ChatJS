import ProfileAvatar from "@/components/ProfileAvatar";
import { ProfileNavBarContainer, ProfileButtons, ProfileUsername, ProfilePhotoContainer, Profile, MicrophoneButton, HeadphoneButton } from "./ProfileNavBar.styled";
import { useDispatch, useSelector } from "react-redux";
import { getUserState } from "@/redux/slices/user";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { MdOutlineHeadphones } from "react-icons/md";
import { TbHeadphonesOff } from "react-icons/tb";
import { getGeneralState } from "@/redux/slices/general";
import { AppDispatch } from "@/redux/store";
import { generalActions } from "@/redux/actions/general";

export default function ProfileNavBar() {
  const user = useSelector(getUserState).user!;
  const dispatch: AppDispatch = useDispatch();
  const { microphone, headphone } = useSelector(getGeneralState)

  return (
    <ProfileNavBarContainer>
      <Profile onClick={() => dispatch(generalActions.toggleProfile())}>
        <ProfilePhotoContainer>
          <ProfileAvatar photo={user.photo} color={user.color} />
        </ProfilePhotoContainer>
        <ProfileUsername color={user.color} >{user.username}</ProfileUsername>
      </Profile>
      <ProfileButtons>
        <MicrophoneButton
          onClick={() => dispatch(generalActions.toggleMicrophone())}
          isActive={microphone}
        >
          {microphone ? <BiMicrophone /> : <BiMicrophoneOff />}
        </MicrophoneButton>
        <HeadphoneButton
          onClick={() => dispatch(generalActions.toggleHeadphone())}
          isActive={headphone}
        >
          {headphone ? <MdOutlineHeadphones /> : <TbHeadphonesOff />}
        </HeadphoneButton>
      </ProfileButtons>
    </ProfileNavBarContainer>
  );
}
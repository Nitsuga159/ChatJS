import { AppDispatch } from "@/redux/store";
import * as S from "./Profile.styled";
import { useDispatch } from "react-redux";
import { generalActions } from "@/redux/actions/general";
import { EAnimationStatus } from "@/components/CSSAnimation/type";
import { useState } from "react";
import { EProfileItem } from "./type";
import Account from "./Account";
import { User } from "@/types/user.type";
import { ReactCrop, type Crop } from "react-image-crop";

export default function Profile({ cssStatus, user }: { cssStatus: EAnimationStatus, user: User }) {

  const dispatch: AppDispatch = useDispatch();
  const [menuOption, setMenuOption] = useState<EProfileItem>(EProfileItem.ACCOUNT);

  const mapProfileContent = {
    [EProfileItem.ACCOUNT]: <Account user={user} />
  }


  return (

    <S.ProfileContainer status={cssStatus} >
      <S.ProfileMain>
        <S.ProfileMenu>
          <S.ProfileMenuItem>Profile</S.ProfileMenuItem>
          <S.ProfileMenuItem>1</S.ProfileMenuItem>
        </S.ProfileMenu>
        <S.ProfileContent>
          {mapProfileContent[menuOption as keyof typeof mapProfileContent]}
        </S.ProfileContent>
        <S.OutIcon onClick={() => dispatch(generalActions.toggleProfile())} />
      </S.ProfileMain>
    </S.ProfileContainer>
  );
}
import * as S from './Account.styled'
import { User } from '@/types/user.type';
import ProfileAvatar from '@/components/ProfileAvatar';
import { useContext, useEffect, useRef, useState } from 'react';
import { COLORS } from '@/styles';
import { IChangesAccount } from './type';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { userActions } from '@/redux/actions/user';
import { setUserToken } from '@/ipc-electron';
import resetAllStates from './resetAllStates';
import { GetProfileImageContext } from '@/components/Providers/GetProfileImage';

export default function Account({ user }: { user: User }) {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { photo, color, description, username } = user;
  const showGetProfileImage = useContext(GetProfileImageContext);
  const [changes, setChanges] =
    useState<IChangesAccount>({ description, color, username, photo: { file: null, url: photo } });
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const descriptionCurrent = descriptionRef.current
    if (descriptionCurrent) {
      descriptionCurrent.style.height = 'auto';
      descriptionCurrent.style.height = descriptionCurrent.scrollHeight + 'px'
    }
  }, [descriptionRef, changes.description]);

  return (
    <S.AccountContainer>
      <S.Header>
        <S.ContainerPhoto onClick={() => photoRef.current?.click()}>
          <ProfileAvatar photo={changes.photo.url} color={color} />
          <input ref={photoRef} type="file" onChange={(e) => {
            if (!showGetProfileImage) return;

            if (e.target.files) showGetProfileImage(e.target.files[0], (image) => setChanges(prev => ({
              ...prev,
              photo: {
                file: image,
                url: URL.createObjectURL(image)
              }
            })))

            e.target.value = "";
          }} hidden />
        </S.ContainerPhoto>
        <S.Username color={color}>{username}</S.Username>
      </S.Header>
      <S.SubContainer>
        <S.Title>Description</S.Title>
        <S.Description
          ref={descriptionRef}
          maxLength={300}
          onChange={(e) => setChanges(prev => ({ ...prev, description: e.target.value }))}
          value={changes.description} />
        <S.Title>Color</S.Title>
        <S.Color
          type="color"
          onChange={(e) => setChanges(prev => ({ ...prev, color: e.target.value }))}
          value={changes.color}
        />
        <S.Buttons>
          <S.Button bgcolor={COLORS.SUCCESS}>save changes</S.Button>
        </S.Buttons>
        <S.Title>Login</S.Title>
        <S.Buttons>
          <S.Button bgcolor={COLORS.FOLLY} onClick={() => {
            setUserToken("");
            resetAllStates(dispatch);
            navigate('/auth')
          }}>logout</S.Button>
        </S.Buttons>
      </S.SubContainer>

    </S.AccountContainer>
  );
}
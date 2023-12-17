import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import * as S from './SearchUser.styled';
import { ESearchStatus, ISearchedUsers } from './type';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function SearchUser({ }) {
  const user = useSelector((state: RootState) => state.user.user);
  const inputRef = useRef(null);
  const [searchedUser, setSearchedUser] = useState<ISearchedUsers>({
    lastId: null,
    continue: true,
    users: []
  });
  const [input, setInput] = useState<string>("");
  const [resetCb, setResetCb] = useState<(() => void) | null>(null);

  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    []
  );

  const handleClickSearch = () =>
    inputRef.current && (inputRef.current as HTMLInputElement).focus();

  const renderItem = (index: number) => {
    const user = searchedUser.users[index];

    return (
      <S.Tab key={user._id}>
        <S.AvatarContainer>
          <ProfileAvatar photo={user.photo} color={user.color} />
        </S.AvatarContainer>
        <S.Username>{user.username}</S.Username>
      </S.Tab>
    );
  }

  const getUsers = async () => {
    try {
      const { data } = await axios.get(`/user/name?username=${input}&lastId=${searchedUser.lastId || ''}`, { headers: { Authorization: `Bearer ${user?.accessToken}` } });

      setSearchedUser((prev) => ({
        ...prev,
        continue: data.continue,
        users: [...prev.users, ...data.result,],
        lastId: data.result.at(-1)?._id || null
      }));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    resetCb && resetCb()

    setSearchedUser({
      lastId: null,
      continue: true,
      users: []
    });
  }, [input]);

  return (
    <S.Container>
      <S.SearchTitle>Search User</S.SearchTitle>
      <S.SearchContainer onClick={handleClickSearch}>
        <S.SearchInput
          value={input}
          ref={inputRef}
          onChange={handleChangeInput}
          maxLength={30}
          placeholder='Search'
        />
        <S.SearchIcon />
      </S.SearchContainer>
      <S.Users>
        {
          input === '' && <UserFound
            text="Search your friends"
            icon={<S.UserIcon />}
          />
        }
        {
          !searchedUser.continue && searchedUser.users.length === 0 && <UserFound
            text="No users found..."
            icon={<S.UserNotFoundIcon />}
          />
        }

        {
          input !== '' &&
          <S.Container>
            <S.UserScroll
              resetCb={setResetCb}
              size={{ width, height: height / 3 }}
              itemsLength={searchedUser.users.length}
              fetchItems={getUsers}
              renderItem={renderItem}
              hasMore={searchedUser.continue}
              loading={<p>cargando</p>}
            />
          </S.Container>
        }
      </S.Users>
    </S.Container>
  );
}

function UserFound({ icon, text }: { icon: JSX.Element, text: string }) {
  return (
    <S.Response>
      {icon}
      <S.TextResponse>{text}</S.TextResponse>
    </S.Response>
  )
}
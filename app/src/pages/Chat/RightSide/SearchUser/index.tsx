import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import * as S from './SearchUser.styled';
import ProfileAvatar from '@/components/ProfileAvatar';
import { User } from '@/types/user.type';
import Loader from '@/components/Svg/Loader/Loader';
import { COLORS } from '@/styles';
import { HttpClientContext } from '@/components/Providers/http';
import { UserInfoNameAPI } from '@/components/Providers/http/api-interface';
import Logger from '@/utils/logger';
import { IsFriendAPI, IsFriendAPIResponse } from '@/components/Providers/http/friend-api-interface';
import { ShowOnAllScreenContext } from '@/components/Providers/ShowOnAllScreen';
import FriendInfo from '@/components/FriendInfo';

export default function SearchUser() {
  const [users, setUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const inputRef = useRef(null);
  const timeRef = useRef<NodeJS.Timeout>()
  const [input, setInput] = useState<string>("");
  const httpClient = useContext(HttpClientContext)!
  const showOnAllScreen = useContext(ShowOnAllScreenContext)

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleClickSearch = () =>
    inputRef.current && (inputRef.current as HTMLInputElement).focus();

  const renderItem = (user: User) => {
    return (
      <S.Tab key={user._id} onClick={async () => {
        const { result: { user: friend, isFriend, hasInvitation } } = (await httpClient!(new IsFriendAPI({ friend_id: user._id }))).data as IsFriendAPIResponse

        showOnAllScreen(() => <FriendInfo friend={friend} isFriend={isFriend} hasInvitation={hasInvitation} />)
      }}>
        <S.AvatarContainer>
          <ProfileAvatar photo={user.photo} color={user.color} />
        </S.AvatarContainer>
        <S.Username>{user.username}</S.Username>
      </S.Tab>
    );
  }

  const getUsers = async () => {
    try {
      const { data: { result } } = await httpClient(new UserInfoNameAPI({ params: { username: input } }));

      setUsers(result.items)
    } catch (e) {
      console.log(e);
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (!input) return;

    clearTimeout(timeRef.current)

    setIsSearching(true)
    setUsers([])

    timeRef.current = setTimeout(() => getUsers(), 700)
  }, [input])

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
          !isSearching && input === '' && <UserFound
            text="Search your friends"
            icon={<S.UserIcon />}
          />
        }
        {
          isSearching && <S.SearchLoader><Loader style={{ width: "100px" }} color={COLORS.FOLLY} /></S.SearchLoader>
        }
        {
          !isSearching && users.length === 0 && input !== "" && <UserFound
            text="No users found..."
            icon={<S.UserNotFoundIcon />}
          />
        }

        {
          input !== '' &&
          <S.Container>
            {
              users.map(renderItem)
            }
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
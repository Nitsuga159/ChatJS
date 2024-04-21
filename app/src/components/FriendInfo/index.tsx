import { SimpleUser } from '@/types/user.type'
import * as S from './FriendInfo.styled'
import { useContext } from 'react'
import { HttpClientContext } from '../Providers/http'
import { FriendNotificationAPI } from '../Providers/http/notification-api-reference'

export default function FriendInfo({ friend, isFriend, hasInvitation }: { friend: SimpleUser, isFriend: boolean, hasInvitation: boolean }) {
    const httpClient = useContext(HttpClientContext)

    return (
        <S.Container>
            <S.Header>
                {friend.photo ? <S.UserImage src={friend.photo} /> : <div>Photo por defecto</div>}
                <S.RightHeader>
                    {
                        isFriend || hasInvitation ?
                            <S.DisableButtonFriend>
                                <S.IconUser />
                            </S.DisableButtonFriend>
                            :
                            <S.AddFriendButton onClick={() => httpClient!(new FriendNotificationAPI({ data: { destined: friend._id } }))} >
                                <S.IconAddUser />
                            </S.AddFriendButton>
                    }
                    <h4 style={{ fontSize: "1.5rem" }}>{friend.username}</h4>
                </S.RightHeader>
            </S.Header>
            <S.Line />
            <S.Description>
                {
                    friend.description ? friend.description?.split("\n").map(paragraph => <p>{paragraph}</p>) : <p>None desciption...</p>
                }
            </S.Description>
        </S.Container>
    )
}
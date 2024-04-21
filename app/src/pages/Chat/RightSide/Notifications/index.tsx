import ENVS from '@/envs'
import * as S from './Notifications.styled'
import { useContext } from 'react'
import { HttpClientContext } from '@/components/Providers/http'
import { DirectionRequest } from '@/redux/actions/channel/type'
import { DeleteNotificationAPI, GetNotificationAPI, NOTIFICATION_TYPE, Notification as NotificationInterface } from '@/components/Providers/http/notification-api-reference'
import { COLORS } from '@/styles'
import { AcceptFriendNotificationAPI } from '@/components/Providers/http/friend-api-interface'
import { useDispatch } from 'react-redux'
import { actions } from '@/redux/slices/scrollItems'

export default function Notification() {
    const dispatch = useDispatch()
    const httpClient = useContext(HttpClientContext)!

    const renderItem = (item: NotificationInterface) => {
        return (
            <S.NotificationItemContainer key={item._id}>
                <S.NotificationItemHeader>
                    <S.SenderImage src={item.sender.photo} />
                    <div>
                        <h4 style={{ fontSize: "1rem" }}>{item.sender.username}</h4>
                        {
                            item.type === NOTIFICATION_TYPE.FRIEND ?
                            <p style={{ fontSize: ".8rem", color: COLORS.SHINE_GRAY }}>wants to be your <strong>friend</strong></p> :
                            <p style={{ fontSize: ".8rem", color: COLORS.SHINE_GRAY }}>wants you to join its <strong>channel</strong></p>
                        }
                    </div>
                </S.NotificationItemHeader>
                <S.Buttons>
                    <S.Button 
                        bgcolor={COLORS.FOLLY} 
                        onClick={async () => {
                            await httpClient(new AcceptFriendNotificationAPI({ data: { notificationId: item._id }}))

                            dispatch(actions.removeOne({ id: ENVS.NOTIFICATION_ITEMS_ID, keyId: ENVS.KEY_ID, valueId: item._id }))
                        }}
                    >
                        accept
                    </S.Button>
                    <S.Button 
                        bgcolor={COLORS.BLACK} 
                        onClick={async () => {
                            await httpClient!(new DeleteNotificationAPI({ notificationId: item._id }))

                            dispatch(actions.removeOne({ id: ENVS.NOTIFICATION_ITEMS_ID, keyId: ENVS.KEY_ID, valueId: item._id }))
                        }}
                        >
                            cancel
                        </S.Button>
                </S.Buttons>
            </S.NotificationItemContainer>
        )
    }

    return (
        <S.Container>
            <S.Title>Notifications</S.Title>
            <S.notificationsScroll
                api={new GetNotificationAPI({})}
                renderItem={renderItem}
                scrollItemsKey={ENVS.NOTIFICATION_ITEMS_ID}
                startFrom={DirectionRequest.DOWN}
                loading={<div>cargando</div>}
            />
        </S.Container>
    )
}
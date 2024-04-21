import { SimpleUser } from "@/types/user.type"
import { DefaultAPI, DefaultAPIProps, HTTP_METHOD } from "./api-interface"
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type"

/* ACCEPT FRIEND NOTIFICATION API */
export interface GetFriendsAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    params?: { to?: DirectionRequest, time?: TimeRequest, lastId?: string }
}

export interface GetFriendsAPIResponse {
    status: 200,
    result: {
        continue: boolean,
        friends: any[]
    }
}

export class GetFriendsAPI extends DefaultAPI {
    constructor(data: GetFriendsAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: "/friend",
        })  
    }
}

/* ACCEPT FRIEND NOTIFICATION API */
export interface AcceptFriendNotificationAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method"> {
    data: {notificationId: string}
}

export interface AcceptFriendNotificationAPIResponse {
    status: number,
    result: {}
}

export class AcceptFriendNotificationAPI extends DefaultAPI {
    constructor(data: AcceptFriendNotificationAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: "/friend",
        })  
    }
}

/* IS FRIEND API */
export interface IsFriendAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method"> {
    friend_id: string
    params?: { fields: string }
}

export interface IsFriendAPIResponse {
    status: number,
    result: {
        hasInvitation: boolean,
        isFriend: boolean,
        user: SimpleUser
    }
}

export class IsFriendAPI extends DefaultAPI {
    constructor(data: IsFriendAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: `/friend/${data.friend_id}/is`,
        })  
    }
}
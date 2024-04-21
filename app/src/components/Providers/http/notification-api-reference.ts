import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type"
import { DefaultAPI, DefaultAPIProps, HTTP_METHOD } from "./api-interface"

export enum NOTIFICATION_TYPE {
    FRIEND = "FRIEND",
    CHANNEL = "CHANNEL"
}

export interface Notification {
    _id: string,
    invitationId: string,
    sender: {
        _id: string,
        username: string,
        photo: string,
        color: string
    },
    destined: string,
    type: NOTIFICATION_TYPE,
    createdAt: string,
    updatedAt: string
}

/* FRIEND NOTIFICATION API */
export interface DeleteNotificationAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    notificationId: string
}

export interface DeleteNotificationAPIResponse {
    status: 200,
    result: {
        _id: string
    }
}

export class DeleteNotificationAPI extends DefaultAPI {
    constructor({ notificationId, ...data}: DeleteNotificationAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.DELETE,
            endpoint: `/notification/${notificationId}`,
        })  
    }
}


/* FRIEND NOTIFICATION API */
export interface GetNotificationAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    params?: { fields?: string, lastId?: string, to?: DirectionRequest, time?: TimeRequest }
}

export interface GetNotificationAPIResponse {
    status: 200,
    result: {
        continue: boolean,
        notifications: Notification[]
    }
}

export class GetNotificationAPI extends DefaultAPI {
    constructor(data: GetNotificationAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: "/notification",
        })  
    }
}

/* FRIEND NOTIFICATION API */
export interface FriendNotificationAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method"> {
    data: { destined: string }
}

export interface FriendNotificationAPIResponse {
    status: 201,
    result: { success: true }
}

export class FriendNotificationAPI extends DefaultAPI {
    constructor(data: FriendNotificationAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: "/notification/friend",
        })  
    }
}
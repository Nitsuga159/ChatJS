import { FriendMessage } from "@/redux/slices/friend/type"
import { DefaultAPI, DefaultAPIProps, HTTP_METHOD } from "./api-interface"
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type"



/* GET FRIEND MESSAGES API */
export interface GetFriendMessagesAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    friendId: string,
    params?: { to?: DirectionRequest, time?: TimeRequest, lastId?: string }
}

export interface GetFriendMessagesAPIResponse {
    status: 200,
    result: {
        continue: boolean,
        messages: any[]
    }
}

export class GetFriendMessagesAPI extends DefaultAPI {
    constructor({ friendId, ...data }: GetFriendMessagesAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: `/friend-chat/${friendId}`,
        })
    }
}

/* CREATE FRIEND MESSAGE API */
export interface CreateFriendMessageAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    friendId: string
    data: { message: { value: string, photos?: string[] } }
}

export interface CreateFriendMessagesPIResponse {
    statusCode: 201,
    result: FriendMessage
}

export class CreateFriendMessageAPI extends DefaultAPI {
    constructor({ friendId, ...data }: CreateFriendMessageAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: `/friend-chat/${friendId}`,
        })
    }
}

/* DELETE FRIEND MESSAGES API */
export interface DeleteFriendMessagesAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    friendId: string
    ids: string[]
}

export interface DeleteFriendMessagesAPIResponse {
    statusCode: 201,
    result: FriendMessage
}

export class DeleteFriendMessagesAPI extends DefaultAPI {
    constructor({ friendId, ids, ...data }: DeleteFriendMessagesAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.DELETE,
            endpoint: `/friend-chat/${friendId}?ids=${ids.join(",")}`,
        })
    }
}
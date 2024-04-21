import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type"
import { DefaultAPI, DefaultAPIProps, HTTP_METHOD } from "./api-interface"

/* GET CHANNEL MESSAGES API */
export interface GetChannelMessagesAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    channelId: string
    params: { chatId: string, to?: DirectionRequest, time?: TimeRequest, lastId?: string, fields?: string }
}

export interface GetChannelMessagesAPIResponse {
    status: 200,
    result: {
        canContinue: boolean,
        items: any[]
    }
}

export class GetChannelMessagesAPI extends DefaultAPI {
    constructor(data: GetChannelMessagesAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: `/channel-chat/message/${data.channelId}`,
        })  
    }
}

/* CREATE CHANNEL MESSAGES API */
export interface CreateChannelMessagesAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    data: { 
        channelChatData: { channelId: string, chatId: string }, 
        message: { value: string, photos?: string[] } 
    }
    params?: { fields: string }
}

export interface CreateChannelMessagesAPIResponse {
    status: 201,
    result: any
}

export class CreateChannelMessagesAPI extends DefaultAPI {
    constructor(data: CreateChannelMessagesAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: "/channel-chat/message",
        })  
    }
}

/* DELETE CHANNEL MESSAGES API */
export interface DeleteChannelMessagesAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    channelId: string
    params: { fields?: string, chatId: string, ids: string }
}

export interface DeleteChannelMessagesAPIResponse {
    status: 200,
    result: any
}

export class DeleteChannelMessagesAPI extends DefaultAPI {
    constructor({ channelId, ...data }: DeleteChannelMessagesAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.DELETE,
            endpoint: `/channel-chat/message/${channelId}`,
        })  
    }
}
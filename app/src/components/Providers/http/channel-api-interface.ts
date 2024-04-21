import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type"
import { DefaultAPI, DefaultAPIProps, HTTP_METHOD } from "./api-interface"
import { ChannelDetail } from "@/redux/slices/channel/type"

/* GET ALL CHANNELS API */
export interface GetChannelsAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    params?: { to?: DirectionRequest, time?: TimeRequest, lastId?: string, fields?: string }
}

export interface GetChannelsAPIResponse {
    status: 200,
    result: {
        canContinue: boolean,
        items: any[]
    }
}

export class GetChannelsAPI extends DefaultAPI {
    constructor(data: GetChannelsAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: "/channel/all",
        })  
    }
}

/* GET CHANNEL DETAIL API */
export interface GetChannelAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    channelId: string
    params?: { lastId?: string, fields?: string }
}

export interface GetChannelAPIResponse {
    status: 200,
    result: ChannelDetail
}

export class GetChannelAPI extends DefaultAPI {
    constructor(data: GetChannelAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: `/channel/${data.channelId}`,
        })  
    }
}

/* CREATE CHANNEL API */
export interface CreateChannelAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    name: string,
    description?: string
    photo?: File
    params?: { fields?: string }
}

export interface CreateChannelAPIResponse {
    status: 201,
    result: ChannelDetail
}

export class CreateChannelAPI extends DefaultAPI {
    constructor({ photo, description, name }: CreateChannelAPIProps) {
        const form = new FormData()

        if(photo) form.append("photo", photo);
        if(description) form.append("description", description);
        form.append("name", name)

        super({
            data: form,
            method: HTTP_METHOD.POST,
            endpoint: "/channel/create",
            headers: { "Content-Type": "multipart/form-data" }
        })  
    }
}


/* DELETE CHANNEL API */
export interface DeleteChannelAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    channelId: string
    params?: { fields?: string }
}

export interface DeleteChannelAPIResponse {
    statusCode: 200,
    result: ChannelDetail
}

export class DeleteChannelAPI extends DefaultAPI {
    constructor({ channelId, ...data }: DeleteChannelAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.DELETE,
            endpoint: `/channel/${channelId}`,
        })  
    }
}


/* CREATE CHANNEL PARTICIPANT API */
export interface CreateChannelParticipantAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    data: { notificationId: string }
    params?: { fields?: string }
}

export interface CreateChannelParticipantAPIResponse {
    statusCode: 201,
    result: ChannelDetail
}

export class CreateChannelParticipantAPI extends DefaultAPI {
    constructor(data: CreateChannelParticipantAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: "/channel/participant",
        })  
    }
}

/* DELETE CHANNEL PARTICIPANT API */
export interface DeleteChannelParticipantAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    channelId: string
    participantId: string
    params?: { fields?: string }
}

export interface DeleteChannelParticipantAPIResponse {
    statusCode: 200,
    result: ChannelDetail
}

export class DeleteChannelParticipantAPI extends DefaultAPI {
    constructor({ channelId, participantId, ...data }: DeleteChannelParticipantAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.DELETE,
            endpoint: `/channel/participant/${channelId}?participantId=${participantId}`,
        })  
    }
}



/* CREATE CHANNEL CHAT API */
export interface CreateChannelChatAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    channelId: string
    data: { chatName: string }
    params?: { fields?: string }
}

export interface CreateChannelAPIResponse {
    status: 201,
    result: ChannelDetail
}

export class CreateChannelChatAPI extends DefaultAPI {
    constructor({ channelId, ...data }: CreateChannelChatAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: `/channel/chat/${channelId}`,
        })  
    }
}

/* DELETE CHANNEL CHAT API */
export interface DeleteChannelChatAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    channelId: string
    params: { fields?: string, chatId: string }
}

export interface DeleteChannelChatAPIResponse {
    statusCode: 200,
    result: ChannelDetail
}

export class DeleteChannelChatAPI extends DefaultAPI {
    constructor({ channelId, ...data }: DeleteChannelChatAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.DELETE,
            endpoint: `/channel/chat/${channelId}`,
        })  
    }
}
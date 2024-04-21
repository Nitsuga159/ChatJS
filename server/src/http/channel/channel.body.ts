import { Transform } from "class-transformer";
import { Allow, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";
import { fieldsTransform, transformObjectId } from "src/utils/fieldsTransform";
import { QueryParameters } from "src/utils/validators";

//POST

export class BodyMapChannel {
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    name: string

    @IsString()
    @IsOptional()
    @MaxLength(300)
    description: string

    @IsString()
    @IsOptional()
    photo: any
}

export class BodyMapChannelAddChat {
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    chatName: string
}

export class BodyMapCheckChannelNotification {
    @Allow()
    @Transform(transformObjectId)
    notificationId: string
}


//UPDATE

export class BodyMapUpdateChannelChat {
    @IsString()
    @MinLength(5)
    @MaxLength(30)
    name: string
}

export class ChannelQuery extends QueryParameters {
    @IsOptional()
    @Transform(
        fieldsTransform(
            ['_id', 'name', 'description', 'admin', 'photo', 'participants', 'chats', 'voices', 'createdAt', 'updatedAt'],
            ['__v']
        )
    )
    fields: Record<string, number> = { __v: 0 };
}

export class ChannelParticipantId {
    @IsOptional()
    @Transform(transformObjectId)
    participantId: Types.ObjectId
}

export class ChannelChatId {
    @IsOptional()
    @Transform(transformObjectId)
    chatId: Types.ObjectId
}

export class ChannelId {
    @IsOptional()
    @Transform(transformObjectId)
    channelId: Types.ObjectId
}
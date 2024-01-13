import { Transform } from "class-transformer";
import { Allow, ArrayMaxSize, IsArray, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { Types } from "mongoose";
import { fieldsTransform, transformObjectId } from "src/utils/fieldsTransform";
import { QueryParameters } from "src/utils/validators";

export class BodyChannelChatMessage {
    @IsString()
    @MaxLength(2500)
    value: string

    @IsArray()
    @ArrayMaxSize(3)
    @IsString({ each: true })
    photos: string[]
}

export class BodyChannelChatData {
    @Allow()
    @Transform(transformObjectId)
    channelId: Types.ObjectId

    @Allow()
    @Transform(transformObjectId)
    chatId: Types.ObjectId
}

export class ChannelChatIds {
    @IsString()
    @Matches(/^[0-9a-fA-F]{24}(,[0-9a-fA-F]{24})*$/)
    ids: string
}

export class ChannelChatQuery extends QueryParameters {
    @IsOptional()
    @Transform(
        fieldsTransform(
            ['_id', 'channelId', 'chatId', 'message', 'createdAt', 'updatedAt'],
            ['__v']
        )
    )
    fields: Record<string, number> = { __v: 0 };
}

export class ChannelChatChatId extends ChannelChatQuery {
    @Allow()
    @Transform(transformObjectId)
    chatId: Types.ObjectId
}

export class ChannelChatChannelId {
    @Allow()
    @Transform(transformObjectId)
    channelId: Types.ObjectId
}
import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsObject, IsOptional, IsString, Matches, MaxLength, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { fieldsTransform, transformObjectId } from "src/utils/fieldsTransform";
import { QueryParameters } from "src/utils/validators";

export class FriendChatMessage {
    @IsString()
    @MaxLength(2500)
    value: string

    @IsArray()
    @ArrayMaxSize(3)
    photos: string[]
}

export class BodyMapFriendChatAddMessage {
    @IsObject()
    @ValidateNested()
    @Type(() => FriendChatMessage)
    message: FriendChatMessage
}

export class FriendChatIds {
    @IsString()
    @Matches(/^[0-9a-fA-F]{24}(,[0-9a-fA-F]{24})*$/)
    ids: string
}


export class FriendChatQuery extends QueryParameters {
    @IsOptional()
    @Transform(
        fieldsTransform(
            ['_id', 'friendId', 'message', 'createdAt', 'updatedAt'],
            ['__v']
        )
    )
    fields: Record<string, number> = { __v: 0 };
}

export class FriendChatId {
    @IsOptional()
    @Transform(transformObjectId)
    friendId: Types.ObjectId
}
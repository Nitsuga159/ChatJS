import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { Types } from "mongoose";
import { fieldsTransform, transformObjectId } from "src/utils/fieldsTransform";
import { QueryParameters } from "src/utils/validators";

export class FriendQuery extends QueryParameters {
    @IsOptional()
    @Transform(
        fieldsTransform(
            ['_id', 'haveChat', 'messagesCount'],
            ['__v']
        )
    )
    fields: Record<string, number> = { __v: 0 };
}

export class FriendId {
    @IsOptional()
    @Transform(transformObjectId)
    friendId: Types.ObjectId
}
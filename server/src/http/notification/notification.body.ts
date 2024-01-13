import { Transform } from "class-transformer";
import { Allow, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { fieldsTransform, transformObjectId } from "src/utils/fieldsTransform";
import { QueryParameters } from "src/utils/validators";

export class BodyNotificationChannel {
    @Allow()
    @Transform(transformObjectId)
    destined: Types.ObjectId

    @Allow()
    @Transform(transformObjectId)
    channelId: Types.ObjectId
}

export class BodyNotificationFriend {
    @Allow()
    @Transform(transformObjectId)
    destined: Types.ObjectId
}

export class NotificationQuery extends QueryParameters {
    @IsOptional()
    @Transform(
        fieldsTransform(
            ['_id', 'sender', 'destined', 'invitationId', 'type', 'createdAt', 'updatedAt'],
            ['__v']
        )
    )
    fields: Record<string, number> = { __v: 0 };
}

export class NotificationId {
    @IsOptional()
    @Transform(transformObjectId)
    notificationId: Types.ObjectId
}
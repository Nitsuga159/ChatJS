import { Types } from "mongoose";
import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware";
import { EQUAL_LENGTH_OBJ, GREATER_LENGTH, IS_OBJECT_ID, IS_STRING, JUST_THIS_PROPERTIES, LESS_LENGTH, NOT_FALSY } from "src/utils/validators";

const CHANNEL_NOTIFICATION: bodyValidationProps = [
    [
        'body', [EQUAL_LENGTH_OBJ(2)]
    ],
    [
        'body.destined', [NOT_FALSY, IS_STRING, IS_OBJECT_ID]
    ],
    [
        'body.channelId', [NOT_FALSY, IS_STRING, IS_OBJECT_ID]
    ]
]

const FRIEND_NOTIFICATION: bodyValidationProps = [
    [
        'body', [EQUAL_LENGTH_OBJ(1)]
    ],
    [
        'body.destined', [NOT_FALSY, IS_STRING, IS_OBJECT_ID]
    ]
]

const NOTIFICATION_MAP = {
    CHANNEL_NOTIFICATION,
    FRIEND_NOTIFICATION,
}

export default NOTIFICATION_MAP
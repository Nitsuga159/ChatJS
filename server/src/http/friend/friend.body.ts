import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware";
import { IS_OBJECT_ID, IS_STRING, NOT_FALSY } from "src/utils/validators";

// GET

export const GET_NOTIFICATION: bodyValidationProps = [
    [
        'query.lastId?', [NOT_FALSY, IS_OBJECT_ID]
    ]
]

// POST

export const NOTIFICATION: bodyValidationProps = [
    [
        'body.notificationId', [NOT_FALSY, IS_STRING, IS_OBJECT_ID]
    ]
]

const FRIEND_MAP = {
    NOTIFICATION,
    GET_NOTIFICATION
}

export default FRIEND_MAP
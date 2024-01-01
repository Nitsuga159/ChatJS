import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware";
import { EQUAL_LENGTH_OBJ, IS_ARRAY, IS_OBJECT, IS_OBJECT_ID, IS_STRING, JUST_THIS_PROPERTIES, LESS_LENGTH, NOT_FALSY, REGEXP } from "src/utils/validators";

// GET

export const GET_MESSAGES: bodyValidationProps = [
    [
        'params.friendId', [IS_OBJECT_ID]
    ],
    [
        'query.lastId?', [NOT_FALSY, IS_OBJECT_ID]
    ]
]

// POST

export const ADD_MESSAGE: bodyValidationProps = [
    [
        'body', [EQUAL_LENGTH_OBJ(1)]
    ],
    [
        'params.friendId', [IS_OBJECT_ID]
    ],
    [
        'body.message', [IS_OBJECT, JUST_THIS_PROPERTIES('value', 'photos')]
    ],
    [
        'body.message.value', [IS_STRING, LESS_LENGTH(2500)]
    ],
    [
        'body.message.photos?', [IS_ARRAY, LESS_LENGTH(4)]
    ],
]

// DELETE

export const DELETE_MESSAGE: bodyValidationProps = [
    [
        'params.friendId', [IS_OBJECT_ID]
    ],
    [
        'query.ids', [NOT_FALSY, REGEXP(/^[0-9a-fA-F]{24}(,[0-9a-fA-F]{24})*$/)]
    ]
]

const FRIEND_CHAT_MAP = {
    ADD_MESSAGE,
    GET_MESSAGES,
    DELETE_MESSAGE
}

export default FRIEND_CHAT_MAP
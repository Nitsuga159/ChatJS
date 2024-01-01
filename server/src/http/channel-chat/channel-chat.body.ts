import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware"
import { IS_ARRAY, IS_OBJECT, IS_OBJECT_ID, IS_STRING, JUST_THIS_PROPERTIES, LESS_LENGTH, NOT_FALSY, REGEXP } from "src/utils/validators"

//GET

const GET_CHANNEL_CHAT_MESSAGES: bodyValidationProps = [
    [
        'params.channelId', [IS_OBJECT_ID]
    ],
    [
        'query.chatId', [IS_OBJECT_ID]
    ],
    [
        'query.lastId?', [IS_OBJECT_ID]
    ]
]

//POST

const ADD_CHANNEL_CHAT_MESSAGE: bodyValidationProps = [
    [
        'body', [JUST_THIS_PROPERTIES('channelChatData', 'message')]
    ],
    [
        'body.channelChatData', [IS_OBJECT, JUST_THIS_PROPERTIES('channelId', 'chatId')]
    ],
    [
        'body.message', [IS_OBJECT, JUST_THIS_PROPERTIES('value', 'photos')]
    ],
    [
        'body.channelChatData.channelId', [IS_STRING, IS_OBJECT_ID]
    ],
    [
        'body.channelChatData.chatId', [IS_STRING, IS_OBJECT_ID]
    ],
    [
        'body.message.value', [IS_STRING, LESS_LENGTH(2500)]
    ],
    [
        'body.message.photos?', [IS_ARRAY, LESS_LENGTH(4)]
    ],
] 

// DELETE

const DELETE_CHANNEL_CHAT_MESSAGES: bodyValidationProps = [
    [
        'params.channelId', [IS_OBJECT_ID]
    ],
    [
        'query.chatId', [IS_OBJECT_ID]
    ],
    [
        'query.ids', [NOT_FALSY, REGEXP(/^[0-9a-fA-F]{24}(,[0-9a-fA-F]{24})*$/)]
    ]
]

const CHANNEL_CHAT_BODY = {
    GET_CHANNEL_CHAT_MESSAGES,
    ADD_CHANNEL_CHAT_MESSAGE,
    DELETE_CHANNEL_CHAT_MESSAGES
}

export default CHANNEL_CHAT_BODY
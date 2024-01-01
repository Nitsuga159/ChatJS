import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware";
import { GREATER_LENGTH, IS_OBJECT_ID, IS_STRING, JUST_THIS_PROPERTIES, LESS_LENGTH, NOT_FALSY, REGEXP } from "src/utils/validators";

//POST

export const BODY_MAP_CHANNEL_CREATE: bodyValidationProps = [
    [
        'body', [JUST_THIS_PROPERTIES('name', 'description', 'photo')]
    ],
    [
        'body.name', [IS_STRING, GREATER_LENGTH(4), LESS_LENGTH(31)]
    ],
    [
        'body.description?', [NOT_FALSY, IS_STRING, LESS_LENGTH(301)]
    ],
    [
        'body.photo?', [IS_STRING]
    ]
]

export const BODY_MAP_CHANNEL_ADD_CHAT: bodyValidationProps = [
    [
        'body.chatName', [IS_STRING, GREATER_LENGTH(4), LESS_LENGTH(30)]
    ]
]

export const BODY_MAP_CHECK_CHANNEL_NOTIFICATION: bodyValidationProps = [
    [
        'body.notificationId', [NOT_FALSY, IS_STRING, IS_OBJECT_ID]
    ]
]


//UPDATE

export const MAP_UPDATE_CHANNEL_CHAT: bodyValidationProps = [
    [
        'body', [JUST_THIS_PROPERTIES('name')]
    ],
    [
        'query.chatId', [IS_OBJECT_ID]
    ],
    [
        'body.name', [IS_STRING, GREATER_LENGTH(5), LESS_LENGTH(30)]
    ],
    [
        'params.channelId', [IS_OBJECT_ID]
    ]
]

export const MAP_UPDATE_CHANNEL: bodyValidationProps = [
    [
        'body', [JUST_THIS_PROPERTIES('name', 'description', 'photo')]
    ],
    [
        'body.name?', [IS_STRING, GREATER_LENGTH(5), LESS_LENGTH(30)]
    ],
    [
        'body.description?', [IS_STRING, LESS_LENGTH(300)]
    ],
    [
        'body.photo?', [IS_STRING, LESS_LENGTH(150)]
    ]
]

//DELETE

export const MAP_DELETE_CHANNEL_CHAT: bodyValidationProps = [
    [
        'query.chatId', [NOT_FALSY, IS_OBJECT_ID]
    ],
    [
        'params.channelId', [NOT_FALSY, IS_OBJECT_ID]
    ]
]

export const MAP_DELETE_PARTICIPANT_CHANNEL: bodyValidationProps = [
    [
        'query.participantId', [IS_OBJECT_ID]
    ],
    [
        'params.channelId', [IS_OBJECT_ID]
    ]
]
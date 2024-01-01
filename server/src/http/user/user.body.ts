import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware";
import { EQUAL_LENGTH_OBJ, GREATER_LENGTH, IS_STRING, JUST_THIS_PROPERTIES, LESS_LENGTH, NOT_FALSY, REGEXP } from "src/utils/validators";

const PASSWORD_VALIDATION = REGEXP(/(?=.*[a-z]){2,}(?=.*[A-Z]){1,}(?=.*\d){1,}(?=.*[^a-zA-Z\d]){1,}/)

export const BODY_MAP_USER: bodyValidationProps = [
    [
        'body', [EQUAL_LENGTH_OBJ(4)]
    ],
    [
        'body.mail', [NOT_FALSY, IS_STRING]
    ],
    [
        'body.password', [NOT_FALSY, IS_STRING, GREATER_LENGTH(7), LESS_LENGTH(30), PASSWORD_VALIDATION]
    ],
    [
        'body.photo', [NOT_FALSY, IS_STRING]
    ],
    [
        'body.username', [NOT_FALSY, IS_STRING]
    ]
]

export const BODY_MAP_LOGIN_REQUEST: bodyValidationProps = [
    [
        'body', [EQUAL_LENGTH_OBJ(2)]
    ],
    [
        'body.mail', [NOT_FALSY, IS_STRING]
    ],
    [
        'body.password', [NOT_FALSY, IS_STRING, GREATER_LENGTH(7), LESS_LENGTH(30), PASSWORD_VALIDATION]
    ]
]

export const BODY_MAP_UPDATE_DATA: bodyValidationProps = [
    [
        'body', [JUST_THIS_PROPERTIES('description', 'photo', 'color', 'username', 'mail')]
    ],
    [   
        'body.mail?', [NOT_FALSY, IS_STRING, REGEXP(/.+@.+\..+/)]
    ],
    [
        'body.description?', [NOT_FALSY, IS_STRING, LESS_LENGTH(10)]
    ],
    [
        'body.photo?', [NOT_FALSY, IS_STRING]
    ],
    [
        'body.color?', [NOT_FALSY, IS_STRING, REGEXP(/^#[a-zA-Z\d]{3}([a-zA-Z\d]{3})?$/)]
    ],
    [
        'body.username?', [NOT_FALSY, IS_STRING, GREATER_LENGTH(4), LESS_LENGTH(20), REGEXP(/^[\w\d]+$/)]
    ],
]

export const BODY_MAP_CHANGE_PASSWORD: bodyValidationProps = [
    [
        'body', [EQUAL_LENGTH_OBJ(2)]
    ],
    [
        'body.password', [NOT_FALSY, IS_STRING, GREATER_LENGTH(7), LESS_LENGTH(30), PASSWORD_VALIDATION]
    ],
    [
        'body.newPassword', [NOT_FALSY, IS_STRING, GREATER_LENGTH(7), LESS_LENGTH(30), PASSWORD_VALIDATION]
    ]
]
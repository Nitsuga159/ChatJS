import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware"
import { CallbackValidator, EQUAL_LENGTH_OBJ, IS_NUMBER, IS_STRING, IS_TYPEOF, NOT_FALSY } from "src/utils/validators"

const BODY_MAP_VERIFY_CODE: bodyValidationProps = [
    [
        'body', [EQUAL_LENGTH_OBJ(2)]
    ],
    [
        'body.mail', [NOT_FALSY, IS_STRING]
    ],
    [
        'body.code', [NOT_FALSY, IS_NUMBER],
    ]
]

export default BODY_MAP_VERIFY_CODE
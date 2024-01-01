import { bodyValidationProps } from "src/middlewares/bodyValidation/dataValidation.middleware"
import { IS_OBJECT } from "src/utils/validators"

export const NEW_CHANNEL_MESSAGE: bodyValidationProps = [
    [
        'body', [IS_OBJECT]
    ]
]

const WS_BODY = {
    NEW_CHANNEL_MESSAGE
}

export default WS_BODY
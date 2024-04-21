import { LANGUAGE } from "../language-interface";

export enum LOGIN_TEXTS {
    WELCOME,
    USERNAME,
    PASSWORD,
    SEE_PASSWORD,
    LOGIN,
    SIGN_UP
}

export default {
    [LANGUAGE.ES]: {
        [LOGIN_TEXTS.WELCOME]: "BIENVENIDO",
        [LOGIN_TEXTS.USERNAME]: "Usuario",
        [LOGIN_TEXTS.PASSWORD]: "Contrseña",
        [LOGIN_TEXTS.SEE_PASSWORD]: "¿Mostrar contrseña?",
        [LOGIN_TEXTS.LOGIN]: "Iniciar",
        [LOGIN_TEXTS.SIGN_UP]: "Registrarse aquí"
    },
    [LANGUAGE.EN]: {
        [LOGIN_TEXTS.WELCOME]: "WELCOME",
        [LOGIN_TEXTS.USERNAME]: "Username",
        [LOGIN_TEXTS.PASSWORD]: "Password",
        [LOGIN_TEXTS.SEE_PASSWORD]: "Show password?",
        [LOGIN_TEXTS.LOGIN]: "Login",
        [LOGIN_TEXTS.SIGN_UP]: "Sign up here"
    }
}
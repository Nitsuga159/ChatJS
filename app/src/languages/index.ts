import { ObjectMap } from "@/basic-types";
import { LANGUAGE } from "./language-interface";
import login from "./texts/login.text";
import channel from './texts/channel.text'

const ALL_TEXTS: any = {
    [LANGUAGE.ES]: {
        ...login[LANGUAGE.ES],
        ...channel[LANGUAGE.ES]
    },
    [LANGUAGE.EN]: {
        ...login[LANGUAGE.EN],
        ...channel[LANGUAGE.EN]
    },
    [LANGUAGE.RU]: {
        ...channel[LANGUAGE.RU]
    },
    [LANGUAGE.PT]: {
        ...channel[LANGUAGE.PT]
    },
    [LANGUAGE.DE]: {
        ...channel[LANGUAGE.DE]
    },
    [LANGUAGE.FR]: {
        ...channel[LANGUAGE.FR]
    }
}

export default function t(language: LANGUAGE, text: number) {
    return ALL_TEXTS[language][text]
}
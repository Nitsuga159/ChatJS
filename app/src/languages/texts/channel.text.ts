import { LANGUAGE } from "../language-interface";

export enum CHANNEL_TEXTS {
    ADD_PARTICIPANT,
    DELETE_PARTICIPANT,
    ADD_CHAT,
    DELETE_CHAT,
    INVITATION_CODE,
    DELETE_CHANNEL,
    LEAVE_CHANNEL
}

export default {
    [LANGUAGE.ES]: {
      [CHANNEL_TEXTS.ADD_PARTICIPANT]: "Añadir participante",
      [CHANNEL_TEXTS.DELETE_PARTICIPANT]: "Eliminar participante",
      [CHANNEL_TEXTS.ADD_CHAT]: "Añadir chat",
      [CHANNEL_TEXTS.DELETE_CHAT]: "Eliminar chat",
      [CHANNEL_TEXTS.INVITATION_CODE]: "Código de invitación",
      [CHANNEL_TEXTS.DELETE_CHANNEL]: "Eliminar canal",
    },
    [LANGUAGE.EN]: {
      [CHANNEL_TEXTS.ADD_PARTICIPANT]: "Add participant",
      [CHANNEL_TEXTS.DELETE_PARTICIPANT]: "Delete participant",
      [CHANNEL_TEXTS.ADD_CHAT]: "Add chat",
      [CHANNEL_TEXTS.DELETE_CHAT]: "Delete chat",
      [CHANNEL_TEXTS.INVITATION_CODE]: "Invitation code",
      [CHANNEL_TEXTS.DELETE_CHANNEL]: "Delete channel",
      [CHANNEL_TEXTS.LEAVE_CHANNEL]: "Leave channel",
    },
    [LANGUAGE.PT]: {
      [CHANNEL_TEXTS.ADD_PARTICIPANT]: "Adicionar participante",
      [CHANNEL_TEXTS.DELETE_PARTICIPANT]: "Excluir participante",
      [CHANNEL_TEXTS.ADD_CHAT]: "Adicionar chat",
      [CHANNEL_TEXTS.DELETE_CHAT]: "Excluir chat",
      [CHANNEL_TEXTS.INVITATION_CODE]: "Código de convite",
      [CHANNEL_TEXTS.DELETE_CHANNEL]: "Excluir canal",
    },
    [LANGUAGE.DE]: {
      [CHANNEL_TEXTS.ADD_PARTICIPANT]: "Teilnehmer hinzufügen",
      [CHANNEL_TEXTS.DELETE_PARTICIPANT]: "Teilnehmer löschen",
      [CHANNEL_TEXTS.ADD_CHAT]: "Chat hinzufügen",
      [CHANNEL_TEXTS.DELETE_CHAT]: "Chat löschen",
      [CHANNEL_TEXTS.INVITATION_CODE]: "Einladungscode",
      [CHANNEL_TEXTS.DELETE_CHANNEL]: "Kanal löschen",
    },
    [LANGUAGE.FR]: {
      [CHANNEL_TEXTS.ADD_PARTICIPANT]: "Ajouter un participant",
      [CHANNEL_TEXTS.DELETE_PARTICIPANT]: "Supprimer un participant",
      [CHANNEL_TEXTS.ADD_CHAT]: "Ajouter un chat",
      [CHANNEL_TEXTS.DELETE_CHAT]: "Supprimer le chat",
      [CHANNEL_TEXTS.INVITATION_CODE]: "Code d'invitation",
      [CHANNEL_TEXTS.DELETE_CHANNEL]: "Supprimer le canal",
    },
    [LANGUAGE.RU]: {
      [CHANNEL_TEXTS.ADD_PARTICIPANT]: "Добавить участника",
      [CHANNEL_TEXTS.DELETE_PARTICIPANT]: "Удалить участника",
      [CHANNEL_TEXTS.ADD_CHAT]: "Добавить чат",
      [CHANNEL_TEXTS.DELETE_CHAT]: "Удалить чат",
      [CHANNEL_TEXTS.INVITATION_CODE]: "Код приглашения",
      [CHANNEL_TEXTS.DELETE_CHANNEL]: "Удалить канал",
    },
  };
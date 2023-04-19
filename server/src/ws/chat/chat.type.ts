export interface MessageToSend {
  _id: string;
  sender: string;
  message: string;
  date: Date;
}

export const WS_MESSAGE_TO_ONE = 'WS_MESSAGE_TO_ONE';
export const WS_MESSAGE_TO_EVERYONE = 'WS_MESSAGE_TO_EVERYONE';

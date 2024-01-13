export enum MessageStatus {
  WAITING,
  FAILURE,
}

export const haveMessageStatus = (status: MessageStatus | undefined): boolean =>
  status === MessageStatus.FAILURE || status === MessageStatus.WAITING;

export interface Message {
  _id?: string;
  createdAt: string;
  updatedAt: string;
  status?: MessageStatus;
  message: {
    value: string;
    photos: string[];
    sender: {
      _id: string;
      username: string;
      color: string;
      photo?: string;
    };
  };
}

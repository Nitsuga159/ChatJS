export enum MessageStatus {
  WAITING,
  FAILURE,
}

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

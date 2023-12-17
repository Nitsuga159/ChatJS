export enum ChatMode {
  CHANNEL_CHAT,
  FRIEND_CHAT,
}

export interface InitialStateGeneral {
  chatMode: ChatMode;
  messagesToDelete: string[];
  microphone: boolean;
  headphone: boolean;
  showProfile: boolean;
}

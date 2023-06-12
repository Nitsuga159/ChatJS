export enum ChatMode {
  CHANNEL_CHAT,
  FRIEND_CHAT,
}

export interface InitialStateSettings {
  chatMode: ChatMode;
}

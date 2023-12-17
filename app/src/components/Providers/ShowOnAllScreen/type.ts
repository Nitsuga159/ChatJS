export interface ShowOnAllScreenType {
  showOnAllScreen: (component: (isOpen: boolean) => JSX.Element) => void;
  isOpen: boolean;
}

export interface SettingsType {
  open: boolean;
  component: (isOpen: boolean) => JSX.Element;
}

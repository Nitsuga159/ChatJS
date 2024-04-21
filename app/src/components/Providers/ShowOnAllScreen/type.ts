export type ShowOnAllScreenType = (component: (isOpen: boolean, close: () => void) => JSX.Element) => void

export interface SettingsType {
  open: boolean;
  component: (isOpen: boolean, close: () => void) => JSX.Element;
}

export type ShowOnAllScreenType = (component: (isOpen: boolean) => JSX.Element) => void

export interface SettingsType {
  open: boolean;
  component: (isOpen: boolean) => JSX.Element;
}

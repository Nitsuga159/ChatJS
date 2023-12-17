export type CoordsType = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export interface IOptionsProps {
  coords?: CoordsType;
  itemsOption: {
    show: JSX.Element;
    onSelect: () => void;
  }[];
}

import { ItemOption, OptionsContainer } from "./Options.styled";
import { IOptionsProps } from "./type";

const defaultCoords = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}

export default function Options({ coords = defaultCoords, itemsOption }: IOptionsProps) {
  return (
    <OptionsContainer coords={coords}>
      {
        itemsOption.map(({ show, onSelect }, index) => (
          <ItemOption key={index} onClick={onSelect}>
            {show}
          </ItemOption>
        ))
      }
    </OptionsContainer>
  )
}
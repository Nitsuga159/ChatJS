import { useState, MouseEvent, useCallback } from "react";
import { ItemSelectionContainer } from "./ItemSelection.styled";
import { ILabelItem, ItemSelectionProps } from "./type";

export default function ItemSelection({ children, name, onClick }: ItemSelectionProps) {
  const [labelItem, setLabelItem] = useState<ILabelItem>({ show: false, top: 0, left: 0 });

  const handleMouseEnter = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const { top, left, width } = (e.target as HTMLDivElement).getBoundingClientRect();

    setLabelItem({ show: true, top: top + width / 4, left: left + width })
  }, []);

  const handleMouseLeave =
    useCallback(() => setLabelItem({ show: false, top: 0, left: 0 }), []);

  return (
    <ItemSelectionContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick()}
      name={name}
      label={labelItem}
      className="button"
    >
      {children}
    </ItemSelectionContainer>
  );
}


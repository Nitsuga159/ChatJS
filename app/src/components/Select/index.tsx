import { SelectProps } from "./type";
import * as S from "./Select.styled"
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function Select({ options, onSelect, title, ...props }: SelectProps) {
    const [open, setOpen] = useState(true)

    return (
        <S.Container>
            <div {...props}>
                <S.TitleContainer onClick={() => setOpen(prev => !prev)}>
                    <S.Title>{title}</S.Title>
                    <IoIosArrowDown />
                </S.TitleContainer>
            </div>
            <S.OptionsContainer open={open} length={options.length}>
                {
                    options.map(({ name, value }) => <S.Option key={value}>{name}</S.Option>)
                }
            </S.OptionsContainer>
        </S.Container>
    )
}
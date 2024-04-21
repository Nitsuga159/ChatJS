import * as S from "./Choice.styled"

export default function Choice({ prompt, options, onSelect }: { prompt: string, options: { name: string, value: any }[], onSelect: (v: any) => void }) {
    return (
        <S.Container>
            <S.Prompt>{prompt}</S.Prompt>
            {
                options.map(
                    ({ name, value }) => <S.ButtonOption key={name} onClick={() => onSelect(value)}>{name}</S.ButtonOption>
                )
            }
        </S.Container>
    )
}
export interface SelectProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onSelect: (value: any) => void
    options: { name: string, value: string }[]
}
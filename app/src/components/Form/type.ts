import { ObjectMap } from "@/basic-types"

export interface Field {
    type: React.HTMLInputTypeAttribute
    name: string
    key: string
    optional: boolean
    validate: (v: any) => string[]
}

export interface FormProps {
    title: string
    fields: Field[]
    submitText: string
    onSumbit: (form: ObjectMap<any>) => void
}
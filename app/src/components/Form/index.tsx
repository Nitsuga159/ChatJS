import { FormProps } from "./type";
import * as S from './Form.styled'
import { useState } from "react";
import { ObjectMap } from "@/basic-types";

export default function Form({ title, submitText, fields, onSumbit }: FormProps) {
    const [form, setForm] = useState<ObjectMap<any>>({})

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setForm(prev => ({ ...prev, [e.target.name]: e.target.type === "text" ? e.target.value : (e.target as any).files[0] }))
    }

    const handleOnSubmit = () => {
        for(let field of fields) {
            if(field.validate(form[field.key]).length) return;
        }

        onSumbit(form)
    } 

    return (
        <S.Container>
            <S.Title>{title}</S.Title>
            {
                fields.map(
                    ({ key, name, type, optional, validate }) => (
                        <S.FieldContainer key={key}>
                            <S.FieldName>{name + (optional ? "" : "*")}</S.FieldName>
                            <S.Input type={type} key={key} name={key} onChange={handleOnChange} />
                            {
                                validate(form[key]).map(error => <S.ErrorText key={error}>* {error}</S.ErrorText>)
                            }
                        </S.FieldContainer>
                    )
                )
            }
            <S.SubmitButton onClick={handleOnSubmit}>{submitText}</S.SubmitButton>
        </S.Container>
    )
}
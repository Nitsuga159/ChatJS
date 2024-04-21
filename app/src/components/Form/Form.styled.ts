import { COLORS } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
    max-height: 80%;
    width: 50%;
    border-radius: 5px;
    padding: 1rem;
    background-color: ${COLORS.BLACK};
    overflow-y: auto;
`

export const Title = styled.h4`
    font-size: 1.2rem;
    border-bottom: 3px solid ${COLORS.BROWN_GRAY};
`

export const FieldContainer = styled.div`
    text-align: left;
    width: 100%;
    margin-top: 1rem;
`

export const FieldName = styled.h5`
    font-size: 1.1rem;
    margin-bottom: .2rem;
`

export const Input = styled.input`
    width: 100%;
    font-size: 1rem;
    padding: .2rem;
    border-radius: 3px;
    background-color: ${COLORS.BROWN_GRAY};
`

export const SubmitButton = styled.button`
    font-size: 1rem;
    font-weight: bold;
    margin-top: 1rem;
    padding: .3rem;
    border-radius: 4px;
    background-color: ${COLORS.FOLLY};
`

export const ErrorText = styled.p`
    margin-top: .2rem;
    color: ${COLORS.ERROR}
`
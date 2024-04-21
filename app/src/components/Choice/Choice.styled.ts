import { COLORS } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
    width: 60%;
    padding: 1rem;
    border-radius: 10px;
    background-color: ${COLORS.BLACK};
`

export const Prompt = styled.h4`
    font-size: 1.5rem;
    text-align: left;
    border-bottom: 2px solid ${COLORS.DARK};
`

export const ButtonOption = styled.button`
    width: 100%;
    padding: .5rem;
    font-weight: bold;
    border-radius: 5px;
    margin-top: .8rem;
    background-color: ${COLORS.LIGHT_GRAY};
    transition: 0.3s ease all;
    &:hover {    
        background-color: ${COLORS.FOLLY};
        letter-spacing: .5px;
    }
`
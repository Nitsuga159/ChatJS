import styled from "styled-components";
import { FieldProps } from "./type";
import { ChangeEvent } from "react";
import { COLORS, PRE_VALUES } from "@/styles";

const Container = styled.div`width: 100%;`;

const LabelContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 1.2rem;
`;

const Label = styled.label`
  ${PRE_VALUES.FLEX}
  justify-content: space-between;
  width: 200px;
  margin: 0;
  padding: 0;
  text-align: left;
  text-transform: capitalize;
`;

const Input = styled.input`
  font-size: 1rem;
  width: 100%;
  border: none;
  outline: none;
  padding: 0.3rem;
  background-color: transparent;
  box-shadow: 0 1px white;
  transition: all 0.2s ease;
  &:focus {
    box-shadow: 0 3px ${COLORS.FOLLY};
  }
`

const Error = styled.p`
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
  font-family: sans-serif;
  font-weight: 100;
  color: var(--folly);
  text-align: right;
`;

export default function Field({ name, value, type, onChange, error }: FieldProps) {
  return (
    <Container>
      <LabelContainer>
        <Label htmlFor={name}>{name}</Label>
        {error && <Error>{error}</Error>}
      </LabelContainer>
      <Input
        id={name}
        name={name}
        type={type}
        title={name}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value, name)}
      />
    </Container>
  );
}
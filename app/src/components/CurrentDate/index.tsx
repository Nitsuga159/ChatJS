import { COLORS } from "@/styles";
import styled from "styled-components";

const Container = styled.p`
  position: relative;
  margin: 1rem 0;
  padding: .4rem 0;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    top: calc(50% - .5px);
    left: 0;
    background-color: ${COLORS.LIGHT_GRAY};
    z-index: 1;
  }
`

const Span = styled.span`
  position: relative;
  font-size: .9rem;
  background-color: ${COLORS.DARK};
  border: 1px solid ${COLORS.LIGHT_GRAY};
  padding: .3rem .9rem;
  border-radius: 10px;
  z-index: 19;
`

export default function CurrentDate({ date }: { date: Date }) {

  const currentDate = date.toLocaleDateString()

  return (
    <Container>
      <Span>
        {
          currentDate === new Date().toLocaleDateString() ?
            "Today" :
            currentDate === new Date(Date.now() - 86400000).toLocaleDateString() ?
              "Yesterday" :
              date.toDateString()
        }
      </Span>
    </Container>
  );
}
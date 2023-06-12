import styled, { keyframes } from "styled-components";
import makeOpacities from "../makeOpacities";
import { COLORS } from "@/styles";

export const Container = styled.div<{ opacity: number }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  margin: .5rem 0;
  border-radius: 10px;
  opacity: ${({ opacity }) => opacity};
  background-color: ${COLORS.BLACK};
`;

const contentAnimation = keyframes`
  from { background-position: 0 0; }
  to { background-position: 200% 0; }
  `;

export const Content = styled.div`
  position: relative;
  width: 100%;
  height: 1rem;
  border-radius: 5px;
  overflow: hidden;
  background: linear-gradient(90deg, ${COLORS.GRAY}, ${COLORS.MIDDLE_GRAY}, ${COLORS.GRAY});
  background-size: 200% 200%;
  animation: ${contentAnimation} 2s linear infinite;
`;

export default function FriendTabSkeleton({ cuantity, reverse }: { cuantity: number; reverse?: true }) {
  return (
    <>
      {
        makeOpacities(cuantity, reverse).map((opacity, index) => (
          <Container opacity={opacity} key={index}>
            <Content />
          </Container>
        ))
      }
    </>
  )
}
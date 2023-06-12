import styled, { keyframes } from "styled-components";
import makeOpacities from "../makeOpacities";
import { COLORS } from "@/styles";

export const Container = styled.div<{ opacity: number }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  margin: 1rem .5rem;
  border-radius: 10px;
  opacity: ${({ opacity }) => opacity};
  background-color: ${COLORS.DARK};
`;

const profileAnimation = keyframes`
  from { background-position: 0 0; }
  to { background-position: 100% 100%; }
`;


export const Profile = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${COLORS.LIGHT_GRAY};
  overflow: hidden;
  background: linear-gradient(135deg, ${COLORS.GRAY} 25%, ${COLORS.MIDDLE_GRAY} 50%, ${COLORS.GRAY} 75%);
  background-size: 300% 300%;
  animation: ${profileAnimation} 2s linear infinite;
`;

const messageAnimation = keyframes`
  from { background-position: 0 0; }
  to { background-position: 200% 0; }
  `;

export const Message = styled.div`
  position: relative;
  width: 100%;
  height: 2rem;
  border-radius: 5px;
  overflow: hidden;
  background: linear-gradient(90deg, ${COLORS.GRAY}, ${COLORS.MIDDLE_GRAY}, ${COLORS.GRAY});
  background-size: 200% 200%;
  animation: ${messageAnimation} 2s linear infinite;
`;

export default function MessageSkeleton({ cuantity, reverse }: { cuantity: number; reverse?: true }) {
  return (
    <>
      {
        makeOpacities(cuantity, reverse).map((opacity, index) => (
          <Container opacity={opacity} key={index}>
            <Profile />
            <Message />
          </Container>
        ))
      }
    </>
  )
}
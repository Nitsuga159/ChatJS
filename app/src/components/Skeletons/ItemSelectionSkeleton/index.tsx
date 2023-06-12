import styled, { keyframes } from "styled-components";
import makeOpacities from "../makeOpacities";
import { COLORS } from "@/styles";

const animation = keyframes`
  0% { background-position: 0 0 }
  100% { background-position: 100% 100% }
`;

const ItemSelection = styled.div<{ opacity: number }>`
  width: 45px;
  height: 45px;
  position: relative;
  border-radius: 50%;
  margin: 0.6rem auto;
  overflow: hidden;
  border: 2px solid ${COLORS.LIGHT_GRAY};
  opacity: ${({ opacity }) => opacity};
  background: linear-gradient(
    130deg,
    ${COLORS.GRAY} 25%,
    ${COLORS.MIDDLE_GRAY} 50%,
    ${COLORS.GRAY} 75%
  );
  background-size: 300% 300%;
  animation: ${animation} 2s linear infinite;
`;

export default function ItemSelectionSkeleton({ cuantity, reverse }: { cuantity: number; reverse?: true }) {
  return (
    <>
      {
        makeOpacities(cuantity, reverse).map((opacity, index) =>
          <ItemSelection opacity={opacity} key={index} />
        )
      }
    </>
  )
}
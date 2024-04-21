import Image from "@/components/Image";
import InfiniteScroll from "@/components/InfiniteScroll";
import { COLORS } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - var(--titlebar-height) - var(--right-side-navbar-height));
    padding: 1rem 0;
`

export const notificationsScroll = styled(InfiniteScroll)`
    height: 100%;
    overflow-y: auto;
`

export const Title = styled.h5`
    height: 1rem;
    font-size: 1rem;
    margin: 0.5rem 0;
    text-align: left;
`

export const NotificationItemContainer = styled.div`
    padding: .4rem;
    border-radius: 4px;
    margin-top: .5rem;
    background-color: ${COLORS.BROWN_GRAY};
`

export const NotificationItemHeader = styled.div`
    display: flex;
    align-items: center;
    gap: .6rem;
    text-align: left;
`

export const SenderImage = styled(Image)`
    height: 40px;
    border-radius: 50%;
`

export const Buttons = styled.div`
    display: flex;
    justify-content: end;
    padding: .3rem;
    gap: .5rem;
    margin-top: .4rem;
`

export const Button = styled.button<{ bgcolor: string }>`
    padding: .3rem;
    border-radius: 4px;
    background-color: ${({ bgcolor }) => bgcolor}
`
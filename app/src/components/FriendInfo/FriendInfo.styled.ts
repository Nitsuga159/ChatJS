import { COLORS } from "@/styles";
import styled from "styled-components";
import Image from "../Image";
import { CiUser } from "react-icons/ci";
import { AiOutlineUserAdd } from "react-icons/ai";

export const Container = styled.div`
    width: 350px;
    padding: 1.5rem;
    border-radius: 5%;
    box-shadow: 5px 5px 0px 4px black;
    background-color: ${COLORS.DARK};
`

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
`

export const UserImage = styled(Image)`
    border-radius: 50%;
    height: 80px;
    box-shadow: 0 0 0 3px ${COLORS.FOLLY};
`

export const RightHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    min-height: 100%;
    text-align: right;
`

export const DisableButtonFriend = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    padding: .2rem;
    border-radius: 5px;
    background-color: ${COLORS.BLACK};
`

export const IconUser = styled(CiUser)`
    font-size: 1.2rem;
`

export const AddFriendButton = styled.div`
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .2rem;
    border-radius: 5px;
    background-color: ${COLORS.SUCCESS};
`

export const IconAddUser = styled(AiOutlineUserAdd)`
    font-size: 1.2rem;
`

export const Description = styled.div`
    padding: .3rem;
    text-align: left;
    border-radius: 5px;
    border: 3px solid ${COLORS.MIDDLE_BLACK};
    background-color: ${COLORS.BLACK};
`

export const Line = styled.div`
    width: 100%;
    height: 2px;
    background-color: white;
    margin: 1rem 0;
`
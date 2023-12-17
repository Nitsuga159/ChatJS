import styled from "styled-components";
import { COLORS, PRE_VALUES } from "@/styles";
import { BsSearch } from "react-icons/bs";
import { FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import InfiniteScroll from "@/components/InfiniteScroll";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const SearchTitle = styled.h5`
  font-size: 1rem;
  margin: 0.5rem 0;
  text-align: left;
`;

export const SearchContainer = styled.div`
  padding: 0.3rem 0.5rem;
  display: flex;
  align-items: center;
  background-color: ${COLORS.FOLLY};
  border-radius: 3px;
`;

export const SearchInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  &::-webkit-input-placeholder {
    color: rgb(202, 202, 202);
  }
`;

export const SearchIcon = styled(BsSearch)`
  cursor: pointer;
`;

export const Users = styled.div`
  flex-grow: 1;
  padding: 1rem 0;
`;

export const Response = styled.div`
  ${PRE_VALUES.FLEX}
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  color: ${COLORS.SHINE_GRAY};
`;

export const TextResponse = styled.p`
  font-size: 1rem;
`;

export const UserNotFoundIcon = styled(FaUserAltSlash)`
  font-size: 3rem;
  color: ${COLORS.FOLLY};
`;

export const UserIcon = styled(FaUserAlt)`
  font-size: 3rem;
  color: ${COLORS.FOLLY};
`;

export const UserScroll = styled(InfiniteScroll)`
  overflow-y: auto;
`;

export const Tab = styled.div`
  display: grid;
  grid-template-columns: 35px 1fr;
  padding: 0.2rem;
  margin: 0.2rem 0;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.GRAY};
  }
`;

export const AvatarContainer = styled.div`
  ${PRE_VALUES.FLEX}
  height: 100%;
  width: 35px;
`;

export const Username = styled.p`
  width: 100%;
  font-weight: bold;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

import { SimpleUser } from "@/types/user.type";

export enum ESearchStatus {
  TO_START,
  LOADING,
  REALIZED,
}

export interface ISearchedUsers {
  lastId: null | string;
  continue: boolean;
  users: SimpleUser[];
}

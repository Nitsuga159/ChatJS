import io, { Socket } from "socket.io-client";

export interface SimpleUser {
  _id: string;
  description: string;
  username: string;
  color: string;
  photo: string | null;
}

export interface User extends SimpleUser {
  mail: string;
  accessToken: string;
}

export interface InitialStateUser {
  user: User | null;
}

export type UserRegister = {
  mail: string;
  username: string;
  password: string;
  "repeat-password": string;
};

export type UserRegisterKeys = keyof UserRegister;

export type VerifyLooading = {
  loading: boolean;
  result: string;
};

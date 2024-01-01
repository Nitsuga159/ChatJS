import { Types } from 'mongoose';
import { UserTypeDocument } from './user-model';

export type LoginRequest = {
  mail: string;
  password: string;
};

export interface UserRequest {
  mail: string,
  username: string,
  password: string,
  photo: string
}

export interface UserType {
  _id: Types.ObjectId;
  mail: string;
  username: string;
  password: string;
  photo: string | null;
  habilited: boolean;
  color: string;
}

export interface LoginResponseType
  extends Omit<UserType, 'password' | 'habilited'> {
  accessToken: string;
}

export type ChangePasswordType = {
  password: string;
  newPassword: string;
};

export type FindUserResponse = {
  continue: boolean;
  result: UserTypeDocument[];
};

export enum Colors {
  RED = '#F00',
  BLUE = '#00F',
}

export const ROUNDS_ENCRYPT = 10;
export const PROPS_UPDATE_USER = ['username', 'color', 'photo'];

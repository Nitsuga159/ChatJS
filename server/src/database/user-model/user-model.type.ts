import { Types } from 'mongoose';
import { UserDocument } from './user-model';

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

export interface PayloadUserAccessToken {
  _id: string,
  scope: [],
  exp: number
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

export type ChangePasswordType = {
  password: string;
  newPassword: string;
};

export type FindUserResponse = {
  canContinue: boolean;
  items: UserDocument[];
};

export enum Colors {
  RED = '#F00',
  BLUE = '#00F',
}

export const USER_VALUE = {
  _id: 1,
  mail: 1,
  username: 1,
  description: 1,
  photo: 1,
  userType: 1,
  color: 1
}

export const ROUNDS_ENCRYPT = 10;
export const PROPS_UPDATE_USER = ['username', 'color', 'photo'];
